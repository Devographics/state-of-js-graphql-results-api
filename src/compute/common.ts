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

/**
 * Add completion information for yearly buckets.
 */
export const appendCompletionToYearlyResults = async <
    T extends { year: number; total: number; completion: Completion }
>(
    db: Db,
    survey: SurveyConfig,
    yearlyResults: Array<Omit<T, 'completion'>>
): Promise<T[]> => {
    const totalRespondentsByYear = await getParticipationByYearMap(db, survey)

    return yearlyResults.map(yearlyResult => {
        return {
            ...yearlyResult,
            completion: {
                total: totalRespondentsByYear[yearlyResult.year],
                count: yearlyResult.total,
                percentage: ratioToPercentage(
                    yearlyResult.total / totalRespondentsByYear[yearlyResult.year]
                )
            }
        }
    }) as T[]
}
