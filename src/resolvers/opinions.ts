import { Db } from 'mongodb'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface OpinionConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeOpinion = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `opinions.${id}`,
        { filters, sort: 'id', order: 1 }
    ])

    
const computeOtherOpinions = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `opinions_others.${id}.others.normalized`,
        { filters, sort: 'id', order: 1 }
    ])

export default {
    Opinion: {
        all_years: async (
            { survey, id, filters }: OpinionConfig,
            args: any,
            { db }: RequestContext
        ) => computeOpinion(db, survey, id, filters),
        year: async (
            { survey, id, filters }: OpinionConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOpinion(db, survey, id, filters)

            return allYears.find(yearItem => yearItem.year === year)
        }
    },
    OtherOpinions: {
        all_years: async (
            { survey, id, filters }: OpinionConfig,
            args: any,
            { db }: RequestContext
        ) => computeOtherOpinions(db, survey, id, filters),
        year: async (
            { survey, id, filters }: OpinionConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherOpinions(db, survey, id, filters)

            return allYears.find(yearItem => yearItem.year === year)
        }
    }

}
