export interface YearParticipation {
    year: number
    participants: number
}

export interface Participation {
    allYears: YearParticipation[]
    year: YearParticipation
}
