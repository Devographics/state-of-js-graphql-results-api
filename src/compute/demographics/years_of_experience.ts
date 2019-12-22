import { Db } from 'mongodb'
import _ from 'lodash'
import { SurveyConfig, YearWorkExperience } from '../../types'
import { ratioToPercentage, appendCompletionToYearlyResults } from '../common'

export async function computeYearsOfExperienceByYear(
    db: Db,
    survey: SurveyConfig
): Promise<YearWorkExperience[]> {
    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    'user_info.years_of_experience': { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        yearsOfExperience: `$user_info.years_of_experience`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
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
            let yearBucket = acc.find((b: any) => b.year === result.year)
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
        bucket.buckets.forEach((subBucket: any) => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults<YearWorkExperience>(db, survey, yearsOfExperienceByYear)
}
