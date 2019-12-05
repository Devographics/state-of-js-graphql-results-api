import {
    computeExperienceOverYears,
    computeParticipationByYear,
    computeGenderBreakdownByYear,
    computeFeatureUsageByYear,
    computeSalaryRangeByYear,
    computeCompanySizeByYear,
    computeYearsOfExperienceByYear,
    computeOpinionByYear,
} from './analysis/index.mjs'

export default {
    Query: {
        tool: async (parent, args, context, info) => {
            return {
                id: args.id,
            }
        },
        demographics: (parent, args, context, info) => {
            return {}
        },
        feature: async (parent, args, context, info) => {
            return {
                id: args.id,
                section: args.section,
            }
        },
        opinion: async (parent, args, context, info) => {
            return {
                id: args.id,
            }
        },
        opinions: async (parent, args, context, info) => {
            return args.ids.map(id => ({
                id
            }))
        },
    },
    Tool: {
        experience: async (tool, args, context, info) => {
            return computeExperienceOverYears(context.db, tool.id)
        },
    },
    Feature: {
        usageByYear: async (feature, args, context, info) => {
            return computeFeatureUsageByYear(context.db, feature.section, feature.id)
        }
    },
    Demographics: {
        participation: async (parent, args, context, info) => {
            return computeParticipationByYear(context.db)
        },
        gender: async (parent, args, context, info) => {
            return computeGenderBreakdownByYear(context.db)
        },
        salary: async (parent, args, context, info) => {
            return computeSalaryRangeByYear(context.db)
        },
        companySize: async (parent, args, context, info) => {
            return computeCompanySizeByYear(context.db)
        },
        yearsOfExperience: async (parent, args, context, info) => {
            return computeYearsOfExperienceByYear(context.db)
        },
    },
    Opinion: {
        byYear: async (opinion, args, context, info) => {
            return computeOpinionByYear(context.db, opinion.id)
        },
        year: async (opinion, args, context, info) => {
            const allYears = await computeOpinionByYear(context.db, opinion.id)

            return allYears.find(y => y.year === args.year)
        },
    }
}
