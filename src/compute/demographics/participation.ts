import _ from 'lodash'
import { Db } from 'mongodb'
import { SurveyConfig, YearParticipation } from '../../types'

export async function computeParticipationByYear(
    db: Db,
    survey: SurveyConfig
): Promise<YearParticipation[]> {
    const collection = db.collection('normalized_responses')

    const participantsByYear = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey
                }
            },
            {
                $group: {
                    _id: { year: '$year' },
                    participants: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    participants: 1
                }
            }
        ])
        .toArray()

    return _.orderBy(participantsByYear, 'year')
}

export async function getParticipationByYearMap(
    db: Db,
    survey: SurveyConfig
): Promise<{
    [key: number]: number
}> {
    const buckets = await computeParticipationByYear(db, survey)

    return buckets.reduce((acc, bucket) => {
        return {
            ...acc,
            [Number(bucket.year)]: bucket.participants
        }
    }, {})
}
