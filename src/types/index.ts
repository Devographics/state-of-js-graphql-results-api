import { Db } from 'mongodb'
import { SurveyType } from '../types'

/**
 * This context is injected in each and every requests.
 */
export interface RequestContext {
    db: Db
}

export interface SurveyConfig {
    survey: SurveyType
    year: number
}

export * from './demographics'
export * from './entity'
export * from './features'
export * from './github'
export * from './opinions'
export * from './other_tools'
export * from './resources'
export * from './schema'
export * from './surveys'
export * from './tools'
