import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common.mjs'

export const computeFeatureUsageByYear = async (db, feature) => {
    const path = `syntax.${feature}`

    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            // exclude null and empty values
            { $match: { [path]: { $nin: [null, ''] } } },
            {
                $group: {
                    _id: {
                        usage: `$${path}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    usage: '$_id.usage',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const usageByYear = _.orderBy(
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
                id: result.usage,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    usageByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, usageByYear)
}
