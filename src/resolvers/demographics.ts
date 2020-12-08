import { Db } from 'mongodb'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { useCache } from '../caching'
import { computeParticipationByYear, computeTermAggregationByYear } from '../compute'

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

const computeCountry = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.country_alpha3',
        { filters, sort: 'id', limit: 999, cutoff: 1 },
        year
    ])

const computeLocale = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.locale',
        { filters, sort: 'id', limit: 100, cutoff: 1 },
        year
    ])

const computeSource = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.source.normalized',
        { filters },
        year
    ])

const computeGender = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.gender',
        { filters, cutoff: 1 },
        year
    ])

const computeRaceEthnicity = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.race_ethnicity.choices',
        { filters, cutoff: 1 },
        year
    ])

const computeSalary = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.yearly_salary',
        { filters, limit: 100, cutoff: 1 },
        year
    ])

const computeCompanySize = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.company_size',
        { filters, limit: 100, cutoff: 1 },
        year
    ])

const computeWorkExperience = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.years_of_experience',
        { filters, limit: 100, cutoff: 1 },
        year
    ])

const computeJobTitle = async (db: Db, survey: SurveyConfig, filters?: Filters, year?: number) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.job_title',
        { filters, cutoff: 1 },
        year
    ])

const computeKnowledgeScore = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.knowledge_score',
        { filters, limit: 100, cutoff: 1 },
        year
    ])

const computeCSSProficiency = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.css_proficiency',
        { filters, sort: 'id', order: 1, cutoff: 1 },
        year
    ])

const computeBackendProficiency = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.backend_proficiency',
        { filters, sort: 'id', order: 1, cutoff: 1 },
        year
    ])

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
    Country: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeCountry(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeCountry(db, survey, filters, year)
            return oneYear[0]
        }
    },
    LocaleStats: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeCountry(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeLocale(db, survey, filters, year)
            return oneYear[0]
        }
    },
    Source: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeSource(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeSource(db, survey, filters, year)
            return oneYear[0]
        }
    },
    Gender: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeGender(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeGender(db, survey, filters, year)
            return oneYear[0]
        }
    },
    RaceEthnicity: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeRaceEthnicity(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeRaceEthnicity(db, survey, filters, year)
            return oneYear[0]
        }
    },
    Salary: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeSalary(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeSalary(db, survey, filters, year)
            return oneYear[0]
        }
    },
    CompanySize: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeCompanySize(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeCompanySize(db, survey, filters, year)
            return oneYear[0]
        }
    },
    WorkExperience: {
        all_years: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => computeWorkExperience(db, survey, filters),
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeWorkExperience(db, survey, filters, year)
            return oneYear[0]
        }
    },
    JobTitle: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeJobTitle(db, survey, filters),
        year: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeJobTitle(db, survey, filters, year)
            return oneYear[0]
        }
    },
    KnowledgeScore: {
        all_years: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => computeKnowledgeScore(db, survey, filters),
        year: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeKnowledgeScore(db, survey, filters, year)
            return oneYear[0]
        }
    }
}
