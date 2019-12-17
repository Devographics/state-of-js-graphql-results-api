/*

Generic aggregation

Used for source, job title, css proficiency, back end proficiency

*/

import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common.mjs'
import { getEntity } from '../helpers.mjs'

export const computeGenericAggregation = async (db, options = {}, key) => {
    let { sort = 'total', order = -1, cutoff = 10, limit = 25 } = options
    const collection = db.collection('normalized_responses')

    let results = await collection
        .aggregate([
            // exclude null and empty values
            { $match: { [key]: { $nin: [null, ''] } } },
            {
                $group: {
                    _id: {
                        id: `$${key}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
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
            let yearBucket = acc.find(b => b.year === result.year)
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
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, byYear)
}
