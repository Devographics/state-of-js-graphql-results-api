import { Db } from 'mongodb'
import { SurveyType } from './surveys'
import { Filters } from '../filters'
import { Options } from '../options'

/**
 * This context is injected in each and every requests.
 */
export interface RequestContext {
    db: Db
}

export interface SurveyConfig {
    survey: SurveyType
}

export interface ResolverStaticConfig {
    survey: SurveyConfig
    filters?: Filters
}

export interface ResolverDynamicConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
    options?: Options
}

export * from './demographics'
export * from './entity'
export * from './features'
export * from './github'
export * from './schema'
export * from './surveys'
export * from './tools'
export * from './locale'
