import {
    computeParticipationByYear
    // computeSalaryRangeByYear,
    // computeCompanySizeByYear,
    // computeYearsOfExperienceByYear,
    // computeGenericAggregation
} from '../compute'
import { RequestContext, SurveyConfig } from '../types'
// import { getCachedResult } from '../caching'

export default {
    Participation: {
        allYears: async (
            { survey }: { survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return computeParticipationByYear(db, survey)
            // return getCachedResult(computeParticipationByYear, context.db)
        },
        year: async ({ survey }: { survey: SurveyConfig }, args: any, { db }: RequestContext) => {
            // const allYears = getCachedResult(computeParticipationByYear, context.db)
            const allYears = await computeParticipationByYear(db, survey)

            return allYears.find(y => y.year === args.year)
        }
    }
    // Country: {
    //     allYears: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.country_alpha3'],
    //             { sort: 'id', limit: 999, cutoff: 1 }
    //         )
    //         return allYears
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.country_alpha3'],
    //             { sort: 'id', limit: 999, cutoff: 1 }
    //         )
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // Source: {
    //     allYears: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.source_normalized'
    //         ])
    //         return allYears
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.source_normalized'
    //         ])
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // Gender: {
    //     allYears: async (parent, args, context, info) => {
    //         return await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.gender'
    //         ])
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.gender'
    //         ])
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // Salary: {
    //     allYears: async (parent, args, context, info) => {
    //         return await getCachedResult(computeSalaryRangeByYear, context.db)
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeSalaryRangeByYear, context.db)
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // CompanySize: {
    //     allYears: async (parent, args, context, info) => {
    //         return await getCachedResult(computeCompanySizeByYear, context.db)
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeCompanySizeByYear, context.db)
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // WorkExperience: {
    //     allYears: async (parent, args, context, info) => {
    //         return await getCachedResult(computeYearsOfExperienceByYear, context.db)
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeYearsOfExperienceByYear, context.db)
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // JobTitle: {
    //     allYears: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.job_title'
    //         ])
    //         return allYears
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(computeGenericAggregation, context.db, [
    //             'user_info.job_title'
    //         ])
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // CSSProficiency: {
    //     allYears: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.css_proficiency'],
    //             { sort: 'id', order: 1 }
    //         )
    //         return allYears
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.css_proficiency'],
    //             { sort: 'id', order: 1 }
    //         )
    //         return allYears.find(y => y.year === args.year)
    //     }
    // },
    // BackendProficiency: {
    //     allYears: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.backend_proficiency'],
    //             { sort: 'id', order: 1 }
    //         )
    //         return allYears
    //     },
    //     year: async (parent, args, context, info) => {
    //         const allYears = await getCachedResult(
    //             computeGenericAggregation,
    //             context.db,
    //             ['user_info.backend_proficiency'],
    //             { sort: 'id', order: 1 }
    //         )
    //         return allYears.find(y => y.year === args.year)
    //     }
    // }
}
