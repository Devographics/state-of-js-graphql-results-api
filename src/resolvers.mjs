import {
    computeExperienceOverYears,
    computeParticipationByYear,
    computeGenderBreakdownByYear,
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
    },
    Tool: {
        experienceOverYears: async (tool, args, context, info) => {
            return computeExperienceOverYears(context.db, tool.id)
        },
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
