import {
    computeExperienceOverYears,
    computeParticipationByYear,
    computeGenderBreakdownByYear,
    computeFeatureUsageByYear,
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
        experienceOverYears: async (tool, args, context, info) => {
            return computeExperienceOverYears(context.db, tool.id)
        },
    },
    Feature: {
        usageByYear: async (feature, args, context, info) => {
            return computeFeatureUsageByYear(context.db, feature.section, feature.id)
        }
    },
    Demographics: {
        participationByYear: async (parent, args, context, info) => {
            return computeParticipationByYear(context.db)
        },
        genderBreakdown: async (parent, args, context, info) => {
            return computeGenderBreakdownByYear(context.db)
        },
    },
}
