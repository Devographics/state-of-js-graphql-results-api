import { Db } from 'mongodb'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { useCache } from '../caching'
import { computeParticipationByYear, computeTermAggregationByYear } from '../compute'

interface DemographicsAggConfig {
    survey: SurveyConfig
    filters?: Filters
}

const computeSource = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.source_normalized',
        { filters }
    ])
}

const computeGender = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.gender',
        { filters, cutoff: 1 }
    ])
}

const computeSalary = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.yearly_salary',
        { filters, limit: 100, cutoff: 1 }
    ])
}

const computeCompanySize = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.company_size',
        { filters, limit: 100, cutoff: 1 }
    ])
}

const computeWorkExperience = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.years_of_experience',
        { filters, limit: 100, cutoff: 1 }
    ])
}

const computeJobTitle = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.job_title',
        { filters, cutoff: 1 }
    ])
}

const computeCSSProficiency = async (db: Db, survey: SurveyConfig, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        'user_info.css_proficiency',
        { filters, sort: 'id', order: 1, cutoff: 1 }
    ])
}

export default {
    Participation: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeParticipationByYear, db, [survey])
        },
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
        allYears: async ({ survey }: DemographicsAggConfig, args: any, { db }: RequestContext) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.country_alpha3',
                { sort: 'id', limit: 999, cutoff: 1 }
            ])
        },
        year: async (
            { survey }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.country_alpha3',
                { sort: 'id', limit: 999, cutoff: 1 }
            ])

            return allYears.find(y => y.year === year)
        }
    },
    Source: {
        allYears: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeSource(db, survey, filters)
        },
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
        allYears: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeGender(db, survey, filters)
        },
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeGender(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    },
    SalaryRange: {
        range_work_for_free: 'work_for_free',
        range_0_10: '0_10',
        range_10_30: '10_30',
        range_30_50: '30_50',
        range_50_100: '50_100',
        range_100_200: '100_200',
        range_more_than_200: 'more_than_200'
    },
    Salary: {
        allYears: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeSalary(db, survey, filters)
        },
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeSalary(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    },
    CompanySizeRange: {
        range_1: '1',
        range_1_5: '1_5',
        range_5_10: '5_10',
        range_10_20: '10_20',
        range_20_50: '20_50',
        range_50_100: '50_100',
        range_100_1000: '100_1000',
        range_more_than_1000: 'more_than_1000'
    },
    CompanySize: {
        allYears: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeCompanySize(db, survey, filters)
        },
        year: async (
            { survey, filters }: DemographicsAggConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeCompanySize(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    },
    WorkExperienceRange: {
        range_less_than_1: 'less_than_1',
        range_1_2: '1_2',
        range_2_5: '2_5',
        range_5_10: '5_10',
        range_10_20: '10_20',
        range_more_than_20: 'more_than_20'
    },
    WorkExperience: {
        allYears: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => {
            return computeWorkExperience(db, survey, filters)
        },
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
        allYears: async (
            { survey, filters }: DemographicsAggConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeJobTitle(db, survey, filters)
        },
        year: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeJobTitle(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    },
    CSSProficiency: {
        allYears: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => {
            return computeCSSProficiency(db, survey, filters)
        },
        year: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeCSSProficiency(db, survey, filters)

            return allYears.find(y => y.year === year)
        }
    },
    BackendProficiency: {
        allYears: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.backend_proficiency',
                { filters, sort: 'id', order: 1, cutoff: 1 }
            ])
        },
        year: async (
            { survey, filters }: { survey: SurveyConfig; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.backend_proficiency',
                { filters, sort: 'id', order: 1, cutoff: 1 }
            ])

            return allYears.find(y => y.year === year)
        }
    }
}
