import _ from 'lodash'

export const computeExperienceOverYears = async (db, tool) => {
    const collection = db.collection('normalized_responses')

    const path = `tools.${tool}.experience`

    const results = await collection.aggregate([
        // exclude null and empty values
        { '$match': { [path]: { '$nin': [null, ''] } } },
        {
            '$group': {
                _id: {
                    experience: `$${path}`,
                    year: '$year',
                },
                total: { '$sum': 1 },
            },
        },
        // reshape documents
        {
            '$project': {
                _id: 0,
                experience: '$_id.experience',
                year: '$_id.year',
                total: 1,
            },
        },
    ]).toArray()

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
                count: result.total,
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    experienceByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = Math.round((subBucket.count / bucket.total) * 1000) / 10
        })
    })

    return experienceByYear
}
