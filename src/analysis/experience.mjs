import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common.mjs'

const computeAwareness = (buckets, total) => {
    const neverHeard = buckets.find(bucket => bucket.id === 'never_heard')

    return ratioToPercentage((total - neverHeard.count) / total)
}

const computeInterest = (buckets, total) => {
    const interested = buckets.find(bucket => bucket.id === 'interested')
    const notInterested = buckets.find(bucket => bucket.id === 'not_interested')

    return ratioToPercentage(interested.count / (interested.count + notInterested.count))
}

const computeSatisfaction = (buckets, total) => {
    const wouldUse = buckets.find(bucket => bucket.id === 'would_use')
    const wouldNotUse = buckets.find(bucket => bucket.id === 'would_not_use')

    return ratioToPercentage(wouldUse.count / (wouldUse.count + wouldNotUse.count))
}

export const computeExperienceOverYears = async (db, tool, survey) => {
    const collection = db.collection('normalized_responses')

    const path = `tools.${tool}.experience`

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
                        experience: `$${path}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    experience: '$_id.experience',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const experienceByYear = _.orderBy(
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
                id: result.experience,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    experienceByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    // compute awareness/interest/satisfaction
    experienceByYear.forEach(bucket => {
        bucket.awarenessInterestSatisfaction = {
            awareness: computeAwareness(bucket.buckets, bucket.total),
            interest: computeInterest(bucket.buckets, bucket.total),
            satisfaction: computeSatisfaction(bucket.buckets, bucket.total)
        }
    })

    return appendCompletionToYearlyResults(db, experienceByYear)
}
