import { Db } from 'mongodb'
import { inspect } from 'util'
import _ from 'lodash'
import config from '../config'
import { Completion, SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { getParticipationByYearMap } from './demographics'
import { useCache } from '../caching'

interface TermAggregationOptions {
    // filter aggregations
    filters?: Filters
    sort?: string
    order?: -1 | 1
    cutoff?: number
    limit?: number
    year?: number
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

    const completionResults = await collection
        .aggregate(aggregationPipeline)
        .toArray() as CompletionResult[]

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
    options: TermAggregationOptions = {}
) {
    const collection = db.collection(config.mongo.normalized_collection)

    const {
        filters,
        sort = 'total',
        order = -1,
        cutoff = 10,
        limit = 25,
        year
    }: TermAggregationOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    // generate an aggregation pipeline for all years, or
    // optionally restrict it to a specific year of data
    const getAggregationPipeline = () => {
        const aggregationMatch = { ...match }
        // if year is passed, restrict aggregation to specific year
        if (year) {
            aggregationMatch.year = year
        }

        const pipeline = [
            {
                $match: aggregationMatch
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

        // only add limit if year is specified
        if (year) {
            pipeline.push({ $limit: limit })
        }
        return pipeline
    }

    const rawResults = await collection.aggregate(getAggregationPipeline()).toArray() as RawResult[] 

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

export async function computeTermAggregationAllYearsWithCache(
    db: Db,
    survey: SurveyConfig,
    id: string,
    options: TermAggregationOptions = {}
) {
    return useCache(computeTermAggregationByYear, db, [survey, id, options])
}

export async function computeTermAggregationSingleYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions
) {
    const allYears = await computeTermAggregationByYear(db, survey, key, options)
    return allYears[0]
}

export async function computeTermAggregationSingleYearWithCache(
    db: Db,
    survey: SurveyConfig,
    id: string,
    options: TermAggregationOptions
) {
    return useCache(computeTermAggregationSingleYear, db, [survey, id, options])
}
