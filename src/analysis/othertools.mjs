/*

Used for: 

- Category other tools (other front-end frameworks, etc.)
- Other tools (utilities, browsers, etc.)
- Resources (podcasts, blogs, etc.)

*/
import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common.mjs'
import { getEntity } from '../helpers.mjs'

export const computeEntityUsage = async (db, key) => {
    const collection = db.collection('normalized_responses')

    let results = await collection
        .aggregate([
            // exclude null and empty values
            { $match: { [key]: { $nin: [null, ''] } } },
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
            // reshape documents
            {
                $project: {
                    _id: 0,
                    id: '$_id.id',
                    year: '$_id.year',
                    total: 1
                }
            },
            { $sort: { total: -1 } },
            { $match: { total: { $gt: 10 } } },
            { $limit: 25 }
        ])
        .toArray()

    // add entities
    results = results.map(result => ({ ...result, entity: getEntity(result) }))

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
