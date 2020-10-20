import { Db } from 'mongodb'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { useCache } from '../caching'
import { computeParticipationByYear, computeTermAggregationByYear } from '../compute'

interface DemographicsAggConfig {
    survey: SurveyConfig
    filters?: Filters
}

const computeCountry = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.country_alpha3',
        { filters, sort: 'id', limit: 999, cutoff: 1 }
    ])

const computeSource = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [survey, 'user_info.source.normalized', { filters }])

const computeGender = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [survey, 'user_info.gender', { filters, cutoff: 1 }])

const computeSalary = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.yearly_salary',
        { filters, limit: 100, cutoff: 1 }
    ])

const computeCompanySize = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.company_size',
        { filters, limit: 100, cutoff: 1 }
    ])

const computeWorkExperience = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.years_of_experience',
        { filters, limit: 100, cutoff: 1 }
    ])

const computeJobTitle = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.job_title',
        { filters, cutoff: 1 }
    ])

const computeCSSProficiency = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.css_proficiency',
        { filters, sort: 'id', order: 1, cutoff: 1 }
    ])

const computeBackendProficiency = async (db: Db, survey: SurveyConfig, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.backend_proficiency',
        { filters, sort: 'id', order: 1, cutoff: 1 }
    ])

export default {
    Participation: {
        all_years: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => useCache(computeParticipationByYear, db, [survey]),
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeParticipationByYear, db, [survey])

            return allYears.find(y => y.year === year)
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
            const allYears = await computeCountry(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeSource(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeGender(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeSalary(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeCompanySize(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeWorkExperience(db, survey, filters)

            return allYears.find(y => y.year === year)
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
            const allYears = await computeJobTitle(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    }
}
