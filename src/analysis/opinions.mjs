import _ from 'lodash'
import { appendCompletionToYearlyResults, ratioToPercentage } from './common.mjs'

export const computeOpinionByYear = async (db, options, opinion, survey) => {
    const path = `opinions.${opinion}`

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
                        opinion: `$${path}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
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
            let yearBucket = acc.find(b => b.year === result.year)
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
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, opinionByYear)
}

export const computeOpinionsByYear = async (db, opinionIds) => {
    const opinionsByYear = []
    for (const opinion of opinionIds) {
        opinionsByYear.push({
            id: opinion,
            byYear: await computeOpinionByYear(db, opinion)
        })
    }

    return opinionsByYear
}
