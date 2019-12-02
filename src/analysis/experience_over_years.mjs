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
                    counts: {}
                }
                acc.push(yearBucket)
            }

            yearBucket.counts[result.experience] = result.total

            return acc
        }, []),
        'year'
    )

    // compute percentages
    experienceByYear.forEach(bucket => {
        bucket.total = _.sum(Object.values(bucket.counts))
        bucket.percentages = Object.entries(bucket.counts).reduce(
            (acc, [experience, count]) => ({
                ...acc,
                [experience]: Math.round((count / bucket.total) * 1000) / 10
            }),
            {}
        )
    })

    return experienceByYear
}
