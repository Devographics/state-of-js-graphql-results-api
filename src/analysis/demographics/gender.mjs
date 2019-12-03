import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from '../common.mjs'

const keyByLabel = {
    'male': 'male',
    'female': 'female',
    'non-binary/ third gender': 'non_binary__third_gender',
}

export const computeGenderBreakdownByYear = async (db) => {
    const collection = db.collection('normalized_responses')

    const results = await collection.aggregate([
        {
            '$match': {
                'user_info.gender': {
                    '$in': [
                        'female',
                        'male',
                        'non-binary/ third gender',
                    ],
                },
            },
        },
        {
            '$group': {
                _id: {
                    year: '$year',
                    gender: '$user_info.gender'
                },
                total: {
                    '$sum': {
                        // exclude years without value
                        '$cond': [
                            { '$ne': [{ '$type': '$user_info.gender' }, 'missing'] },
                            1, 0
                        ],
                    },
                },
            },
        },
        // reshape documents
        {
            '$project': {
                _id: 0,
                year: '$_id.year',
                gender: '$_id.gender',
                total: 1,
            },
        },
    ]).toArray()

    // group by years and add counts
    const genderBreakdownByYear = _.orderBy(
        results.reduce((acc, result) => {
            let yearBucket = acc.find(b => b.year === result.year)
            if (yearBucket === undefined) {
                yearBucket = {
                    year: result.year,
                    buckets: [],
                }
                acc.push(yearBucket)
            }

            yearBucket.buckets.push({
                id: keyByLabel[result.gender],
                count: result.total,
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    genderBreakdownByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    return appendCompletionToYearlyResults(db, genderBreakdownByYear)
}

