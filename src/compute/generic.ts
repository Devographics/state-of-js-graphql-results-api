import { Db } from 'mongodb'
import { SurveyConfig, Filters } from '../types'
import _ from 'lodash'
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
    const collection = db.collection('normalized_responses')

    const {
        filters,
        sort = 'total',
        order = -1,
        cutoff = 10,
        limit = 25
    }: TermAggregationByYearOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, ''] }
    }
    if (filters !== undefined) {
        if (filters.gender !== undefined) {
            match['user_info.gender'] = filters.gender
        }
    }

    const rawResults: RawResult[] = await collection
        .aggregate([
            {
                $match: match
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
        ])
        .toArray()

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
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    resultsByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach((subBucket: any) => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, survey, resultsByYear)
}
