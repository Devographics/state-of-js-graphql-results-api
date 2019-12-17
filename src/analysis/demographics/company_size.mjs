import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from '../common.mjs'

export const computeCompanySizeByYear = async (db) => {
    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            // exclude null and empty values
            { $match: { 'user_info.company_size': { $nin: [null, ''] } } },
            {
                $group: {
                    _id: {
                        companySize: `$user_info.company_size`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    companySize: '$_id.companySize',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const companySizeByYear = _.orderBy(
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
                id: result.companySize,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    companySizeByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, companySizeByYear)
}
