import { Db } from 'mongodb'
import { getParticipationByYearMap } from './demographics'
import { Completion, SurveyConfig } from '../types'

/**
 * Convert a ratio to percentage, applying a predefined rounding.
 */
export const ratioToPercentage = (ratio: number) => {
    return Math.round(ratio * 1000) / 10
}

/**
 * Compute completion percentage.
 */
export const computeCompletion = (answerCount: number, totalCount: number) => {
    return ratioToPercentage(answerCount / totalCount)
}

export const appendCompletionToYearlyResults = async (
    db: Db,
    survey: SurveyConfig,
    yearlyResults: any[]
): Promise<Array<{
    year: number
    total: number
    completion: Completion
}>> => {
    const totalRespondentsByYear = await getParticipationByYearMap(db, survey)

    return yearlyResults.map(yearlyResult => {
        return {
            ...yearlyResult,
            completion: {
                percentage: ratioToPercentage(
                    yearlyResult.total / totalRespondentsByYear[yearlyResult.year]
                ),
                count: yearlyResult.total
            }
        }
    })
}
