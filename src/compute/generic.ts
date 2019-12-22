import { Db } from 'mongodb'
import { SurveyConfig } from '../types'
import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common'
import { getEntity } from '../helpers'

interface TermAggregationByYearOptions {
    sort?: string
    order?: -1 | 1
    cutoff?: number
    limit?: number
}

export async function computeTermAggregationByYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationByYearOptions = {}
) {
    const collection = db.collection('normalized_responses')

    const {
        sort = 'total',
        order = -1,
        cutoff = 10,
        limit = 25
    }: TermAggregationByYearOptions = options

    let results = await collection
        .aggregate([
            {
                $match: {
                    [key]: { $nin: [null, ''] }
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
        ])
        .toArray()

    // add entities if applicable
    results = results.map(result => {
        const entity = getEntity(result)

        return entity ? { ...result, entity } : result
    })

    // group by years and add counts
    const byYear = _.orderBy(
        results.reduce((acc, result) => {
            let yearBucket = acc.find((b: any) => b.year === result.year)
            if (yearBucket === undefined) {
                yearBucket = {
                    year: result.year,
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
    byYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach((subBucket: any) => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, survey, byYear)
}
