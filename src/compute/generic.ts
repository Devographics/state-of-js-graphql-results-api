import { Db } from 'mongodb'
import { inspect } from 'util'
import _ from 'lodash'
import config from '../config'
import { Completion, SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common'
import { getEntity } from '../helpers'

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

export async function computeTermAggregationByYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationByYearOptions = {}
) {
    const collection = db.collection(config.mongo.normalized_collection)

    const {
        filters,
        sort = 'total',
        order = -1,
        cutoff = 10,
        limit = 25
    }: TermAggregationByYearOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    const aggregationPipeline = [
        {
            $match: match
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
    const rawResults: RawResult[] = await collection.aggregate(aggregationPipeline).toArray()

    console.log(
        inspect(
            {
                match,
                aggregationPipeline,
                rawResults
            },
            { colors: true, depth: null }
        )
    )

    // add entities if applicable
    const resultsWithEntity: RawResult[] = rawResults.map(result => {
        const entity = getEntity(result as any)

        return entity ? { ...result, entity } : result
    })

    // group by years and add counts
    const resultsByYear = _.orderBy(
        resultsWithEntity.reduce((acc: YearAggregations[], result) => {
            let yearBucket = acc.find(b => b.year === result.year)
            if (yearBucket === undefined) {
                yearBucket = {
                    year: result.year,
                    total: 0,
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
        year.total = _.sumBy(year.buckets, 'count')
        year.buckets.forEach(bucket => {
            bucket.percentage = ratioToPercentage(bucket.count / year.total)
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
                    bucket.percentageDelta = Math.round(100 * (bucket.percentage - previousYearBucket.percentage))/100
                }
            })
        }
    })

    return appendCompletionToYearlyResults<{
        year: number
        completion: Completion
        total: number
        buckets: TermBucket[]
    }>(db, survey, resultsByYear)
}
