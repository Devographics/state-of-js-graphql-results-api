/**
 * Used to represent survey question completion.
 */
export interface Completion {
    // current number of respondents
    count: number
    // percentage of respondents for a question
    // compared to the total number of participants
    percentage: number
}
