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
    percentage: number
}

interface YearAggregations {
    year: number
    total: number
    buckets: TermBucket[]
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
    resultsByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults<{
        year: number
        completion: Completion
        total: number
        buckets: TermBucket[]
    }>(db, survey, resultsByYear)
}
