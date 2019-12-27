import { RequestContext, SurveyConfig } from '../types'
import { useCache } from '../caching'
import { computeParticipationByYear, computeTermAggregationByYear } from '../compute'

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
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.country_alpha3',
                { sort: 'id', limit: 999, cutoff: 1 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
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
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.source_normalized'
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.source_normalized'
            ])

            return allYears.find(y => y.year === year)
        }
    },
    Gender: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [survey, 'user_info.gender'])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.gender'
            ])

            return allYears.find(y => y.year === year)
        }
    },
    Salary: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.yearly_salary',
                { limit: 100 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.yearly_salary',
                { limit: 100 }
            ])

            return allYears.find(y => y.year === year)
        }
    },
    CompanySize: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.company_size',
                { limit: 100 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.company_size',
                { limit: 100 }
            ])

            return allYears.find(y => y.year === year)
        }
    },
    WorkExperience: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.years_of_experience',
                { limit: 100 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.years_of_experience',
                { limit: 100 }
            ])

            return allYears.find(y => y.year === year)
        }
    },
    JobTitle: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [survey, 'user_info.job_title'])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.job_title'
            ])

            return allYears.find(y => y.year === year)
        }
    },
    CSSProficiency: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.css_proficiency',
                { sort: 'id', order: 1 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.css_proficiency',
                { sort: 'id', order: 1 }
            ])

            return allYears.find(y => y.year === year)
        }
    },
    BackendProficiency: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.backend_proficiency',
                { sort: 'id', order: 1 }
            ])
        },
        year: async (
            { survey }: { survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                'user_info.backend_proficiency',
                { sort: 'id', order: 1 }
            ])

            return allYears.find(y => y.year === year)
        }
    }
}
