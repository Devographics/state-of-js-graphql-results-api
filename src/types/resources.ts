import { Completion } from './index'
import { EntityBucket } from './entity'

export interface YearResources {
    year: number
    total: number
    completion: Completion
    buckets: EntityBucket[]
}

export interface Resources {
    id: string
    allYears: YearResources[]
    year: YearResources
}
