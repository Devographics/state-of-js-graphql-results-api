import { getParticipationByYearMap } from './demographics/index.mjs'

export const ratioToPercentage = ratio => {
    return Math.round(ratio * 1000) / 10
}

export const computeCompletion = (answerCount, totalCount) => {
    return ratioToPercentage(answerCount / totalCount)
}

export const appendCompletionToYearlyResults = async (db, yearlyResults) => {
    const totalRespondentsByYear = await getParticipationByYearMap(db)

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
