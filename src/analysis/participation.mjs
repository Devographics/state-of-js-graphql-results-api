import _ from 'lodash'

export const computeParticipationByYear = async (db) => {
    const collection = db.collection('normalized_responses')

    const participantsByYear = await collection.aggregate([
        {
            '$group': {
                _id: { year: '$year' },
                participants: { '$sum': 1 },
            },
        },
        // reshape documents
        {
            '$project': {
                _id: 0,
                year: '$_id.year',
                participants: 1,
            },
        },
    ]).toArray()

    return _.orderBy(participantsByYear, 'year')
}
