import { Db } from 'mongodb'
import _ from 'lodash'
import { SurveyConfig, YearCompanySize } from '../../types'
import { ratioToPercentage, appendCompletionToYearlyResults } from '../common'

export async function computeCompanySizeByYear(
    db: Db,
    survey: SurveyConfig
): Promise<YearCompanySize[]> {
    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    'user_info.company_size': { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        companySize: `$user_info.company_size`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
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
            let yearBucket = acc.find((b: any) => b.year === result.year)
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
        bucket.buckets.forEach((subBucket: any) => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults<YearCompanySize>(db, survey, companySizeByYear)
}
