import _ from 'lodash'
import { appendCompletionToYearlyResults, ratioToPercentage } from './common.mjs'

export const computeHappinessByYear = async (db, id, survey) => {
    const path = `happiness.${id}`

    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    // exclude null and empty values
                    [path]: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        id: `$${path}`,
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
            }
        ])
        .toArray()

    // group by years and add counts
    const happinessByYear = _.orderBy(
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
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    happinessByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets = _.orderBy(bucket.buckets, 'id')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    // compute mean for each year
    happinessByYear.forEach(bucket => {
        const totalScore = bucket.buckets.reduce((acc, subBucket) => {
            return acc + subBucket.id * subBucket.count
        }, 0)
        bucket.mean = Math.round((totalScore / bucket.total) * 10) / 10 + 1
    })

    return appendCompletionToYearlyResults(db, happinessByYear)
}
