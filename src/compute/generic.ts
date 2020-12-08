import { Db } from 'mongodb'
import { inspect } from 'util'
import _ from 'lodash'
import config from '../config'
import { Completion, SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { getParticipationByYearMap } from './demographics'

interface TermAggregationByYearOptions {
    // filter aggregations
    filters?: Filters
    sort?: string
    order?: -1 | 1
    cutoff?: number
    limit?: number
}

interface RawResult {
    id: number | string
    entity?: any
    year: number
    total: number
}

interface CompletionResult {
    year: number
    total: number
}

interface TermBucket {
    id: number | string
    entity?: any
    count: number
    countDelta?: number
    percentage: number
    percentageDelta?: number
}

interface YearAggregations {
    year: number
    total: number
    completion: Completion
    buckets: TermBucket[]
}

export async function getSurveyTotals(db: Db, surveyConfig: SurveyConfig, year?: Number) {
    const collection = db.collection(config.mongo.normalized_collection)
    let selector: any = {
        survey: surveyConfig.survey
    }
    if (year) {
        selector = { ...selector, year }
    }
    return collection.countDocuments(selector)
}

export async function computeCompletionByYear(
    db: Db,
    match: any
): Promise<Record<number, CompletionResult>> {
    const collection = db.collection(config.mongo.normalized_collection)

    const aggregationPipeline = [
        {
            $match: match
        },
        {
            $group: {
                _id: { year: '$year' },
                total: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                year: '$_id.year',
                total: 1
            }
        }
    ]

    const completionResults: CompletionResult[] = await collection
        .aggregate(aggregationPipeline)
        .toArray()

    // console.log(
    //     inspect(
    //         {
    //             aggregationPipeline,
    //             completionResults,
    //         },
    //         { colors: true, depth: null }
    //     )
    // )

    return _.keyBy(completionResults, 'year')
}

export async function computeTermAggregationByYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationByYearOptions = {},
    year?: number
) {
    const collection = db.collection(config.mongo.normalized_collection)

    const yearArray = year ? [year] : [2016, 2017, 2018, 2019, 2020]

    const {
        filters,
        sort = 'total',
        order = -1,
        cutoff = 2,
        limit = 25
    }: TermAggregationByYearOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    // generate an aggregation pipeline for a year of data
    const getAggregationPipeline = (year: number) => [
        {
            $match: { ...match, year }
        },
        {
            $unwind: {
                path: `$${key}`
            }
        },
        {
            $group: {
                _id: {
                    id: `$${key}`,
                    year: '$year'
                },
                total: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                id: '$_id.id',
                year: '$_id.year',
                total: 1
            }
        },
        { $sort: { [sort]: order } },
        { $match: { total: { $gt: cutoff } } },
        { $limit: limit }
    ]

    // get all results for all years specified
    const getResults = async () =>
        Promise.all(
            yearArray.map(year => collection.aggregate(getAggregationPipeline(year)).toArray())
        )
    const resultsNested = await getResults()
    const rawResults: RawResult[] = resultsNested.flat()

    // console.log(
    //     inspect(
    //         {
    //             match,
    //             sampleAggregationPipeline: getAggregationPipeline(2020),
    //             rawResults
    //         },
    //         { colors: true, depth: null }
    //     )
    // )

    // add entities if applicable
    const resultsWithEntity: RawResult[] = rawResults.map(result => {
        const entity = getEntity(result as any)

        return entity ? { ...result, entity } : result
    })

    const totalRespondentsByYear = await getParticipationByYearMap(db, survey)
    const completionByYear = await computeCompletionByYear(db, match)

    // group by years and add counts
    const resultsByYear = _.orderBy(
        resultsWithEntity.reduce((acc: YearAggregations[], result) => {
            let yearBucket = acc.find(b => b.year === result.year)
            if (yearBucket === undefined) {
                const totalRespondents = totalRespondentsByYear[result.year] ?? 0
                const completionCount = completionByYear[result.year]?.total ?? 0

                yearBucket = {
                    year: result.year,
                    total: totalRespondents,
                    completion: {
                        total: totalRespondents,
                        count: completionCount,
                        percentage: ratioToPercentage(completionCount / totalRespondents)
                    },
                    buckets: []
                }

                acc.push(yearBucket)
            }

            yearBucket.buckets.push({
                id: result.id,
                entity: result.entity,
                count: result.total,
                percentage: 0
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    resultsByYear.forEach(year => {
        let yearTotalPercents = 0
        year.buckets.forEach(bucket => {
            bucket.percentage = ratioToPercentage(bucket.count / year.completion.count)
            yearTotalPercents += bucket.percentage
        })
    })

    // compute deltas
    resultsByYear.forEach((year, i) => {
        const previousYear = resultsByYear[i - 1]
        if (previousYear) {
            year.buckets.forEach(bucket => {
                const previousYearBucket = previousYear.buckets.find(b => b.id === bucket.id)
                if (previousYearBucket) {
                    bucket.countDelta = bucket.count - previousYearBucket.count
                    bucket.percentageDelta =
                        Math.round(100 * (bucket.percentage - previousYearBucket.percentage)) / 100
                }
            })
        }
    })

    return resultsByYear
}
