import { Completion } from './index'

export interface OpinionBucket {
    id: string
    count: number
    percentage: number
}

export interface YearOpinion {
    year: number
    total: number
    completion: Completion
    buckets: OpinionBucket[]
}

export interface Opinion {
    id: string
    allYears: YearOpinion[]
    year: YearOpinion
}
