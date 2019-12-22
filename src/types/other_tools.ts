import { Completion } from './index'
import { EntityBucket } from './entity'

export interface YearOtherTools {
    year: number
    total: number
    completion: Completion
    buckets: EntityBucket
}

export interface OtherTools {
    id: string
    year: YearOtherTools
    allYears: YearOtherTools[]
}
