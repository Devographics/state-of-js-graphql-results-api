import { Completion } from './index'
import { MDN } from './mdn'

export interface FeatureBucket {
    id: string
    name: string
    count: number
    percentage: number
}

export interface YearFeature {
    year: number
    total: number
    completion: Completion
    buckets: FeatureBucket[]
}

export interface FeatureExperienceBucket {
    id: string
    count: number
    percentage: number
}

export interface FeatureExperience {
    allYears: YearFeature[]
    year: YearFeature
}

export interface Feature {
    id: string
    name: string
    mdn: MDN
    experience: FeatureExperience
}
