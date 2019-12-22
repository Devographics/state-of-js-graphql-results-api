import _ from 'lodash'
import { Db } from 'mongodb'
import { appendCompletionToYearlyResults, ratioToPercentage } from './common'
import { SurveyConfig } from '../types'

export const computeOpinionByYear = async (db: Db, survey: SurveyConfig, opinion: string) => {
    const path = `opinions.${opinion}`

    const collection = db.collection('normalized_responses')

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    [path]: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        opinion: `$${path}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    opinion: '$_id.opinion',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const opinionByYear = _.orderBy(
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
                id: result.opinion,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    opinionByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets = _.orderBy(bucket.buckets, 'id')
        bucket.buckets.forEach((subBucket: any) => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, survey, opinionByYear)
}

export const computeOpinionsByYear = async (db: Db, survey: SurveyConfig, opinionIds: string[]) => {
    const opinionsByYear: any[] = []
    for (const opinion of opinionIds) {
        opinionsByYear.push({
            id: opinion,
            byYear: await computeOpinionByYear(db, survey, opinion)
        })
    }

    return opinionsByYear
}
