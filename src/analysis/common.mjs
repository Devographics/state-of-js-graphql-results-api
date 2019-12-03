export const ratioToPercentage = (ratio) => {
    return Math.round((ratio * 1000)) / 10
}

export const computeCompletion = (answerCount, totalCount) => {
    return ratioToPercentage(answerCount / totalCount)
}
