import {
    computeExperienceOverYears,
    computeParticipationByYear,
    computeGenderBreakdownByYear,
    computeFeatureUsageByYear,
    computeSalaryRangeByYear,
    computeCompanySizeByYear,
    computeYearsOfExperienceByYear,
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
        genderBreakdown: async (parent, args, context, info) => {
            return computeGenderBreakdownByYear(context.db)
        },
        salaryRange: async (parent, args, context, info) => {
            return computeSalaryRangeByYear(context.db)
        },
        companySize: async (parent, args, context, info) => {
            return computeCompanySizeByYear(context.db)
        },
        yearsOfExperience: async (parent, args, context, info) => {
            return computeYearsOfExperienceByYear(context.db)
        },
    },
}
