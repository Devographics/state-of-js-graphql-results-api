import { Db } from 'mongodb'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { useCache } from '../caching'
import {
    computeParticipationByYear,
    computeTermAggregationAllYearsWithCache,
    computeTermAggregationSingleYearWithCache
} from '../compute'

interface DemographicsAggConfig {
    survey: SurveyConfig
    filters?: Filters
}

const computeParticipation = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) => useCache(computeParticipationByYear, db, [survey, filters, year])

const getDemographicsResolvers = (id: string, options: any = {}) => ({
    all_years: async (
        { survey, filters }: DemographicsAggConfig,
        args: any,
        { db }: RequestContext
    ) => computeTermAggregationAllYearsWithCache(db, survey, id, { ...options, filters }),
    year: async (
        { survey, filters }: DemographicsAggConfig,
        { year }: { year: number },
        { db }: RequestContext
    ) => computeTermAggregationSingleYearWithCache(db, survey, id, { ...options, filters, year })
})

export default {
    Participation: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeParticipation(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeParticipation(db, survey, filters, year)
            return oneYear[0]
        }
    },

    Country: getDemographicsResolvers('user_info.country_alpha3', {
        sort: 'id',
        limit: 999,
        cutoff: 1
    }),
    
    LocaleStats: getDemographicsResolvers('user_info.locale', {
        sort: 'id',
        limit: 100,
        cutoff: 1
    }),
    
    Source: getDemographicsResolvers('user_info.source.normalized'),

    Gender: getDemographicsResolvers('user_info.gender', { cutoff: 1 }),

    RaceEthnicity: getDemographicsResolvers('user_info.race_ethnicity.choices', { cutoff: 1 }),
    
    Salary: getDemographicsResolvers('user_info.yearly_salary', { limit: 100, cutoff: 1 }),
    
    CompanySize: getDemographicsResolvers('user_info.company_size', { limit: 100, cutoff: 1 }),
    
    WorkExperience: getDemographicsResolvers('user_info.years_of_experience', {
        limit: 100,
        cutoff: 1
    }),

    JobTitle: getDemographicsResolvers('user_info.job_title', {
        cutoff: 1
    }),

    KnowledgeScore: getDemographicsResolvers('user_info.knowledge_score', { limit: 100, cutoff: 1 })
}
