import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from '../common.mjs'

export const computeYearsOfExperienceByYear = async db => {
    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            // exclude null and empty values
            { $match: { 'user_info.years_of_experience': { $nin: [null, ''] } } },
            {
                $group: {
                    _id: {
                        yearsOfExperience: `$user_info.years_of_experience`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    yearsOfExperience: '$_id.yearsOfExperience',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const yearsOfExperienceByYear = _.orderBy(
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
                id: result.yearsOfExperience,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    yearsOfExperienceByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, yearsOfExperienceByYear)
}
