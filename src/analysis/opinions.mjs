import _ from "lodash";
import { appendCompletionToYearlyResults, ratioToPercentage } from './common.mjs'

export const getOpinionIds = async (db) => {
    const collection = db.collection('normalized_responses')

    const result = await collection.aggregate([
        {
            '$project':{
                keys: {
                    '$objectToArray': '$opinions'
                }
            }
        },
        { '$unwind': '$keys' },
        {
            '$group': {
                _id: null,
                keys: {
                    '$addToSet': '$keys.k'
                }
            }
        }
    ]).toArray()

    return result[0].keys
}

export const computeOpinionByYear = async (db, opinion) => {
    const path = `opinions.${opinion}`

    const collection = db.collection('normalized_responses')

    const results = await collection.aggregate([
        // exclude null and empty values
        { '$match': { [path]: { '$nin': [null, ''] } } },
        {
            '$group': {
                _id: {
                    opinion: `$${path}`,
                    year: '$year',
                },
                total: { '$sum': 1 },
            },
        },
        // reshape documents
        {
            '$project': {
                _id: 0,
                opinion: '$_id.opinion',
                year: '$_id.year',
                total: 1,
            },
        },
    ]).toArray()

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
                count: result.total,
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

