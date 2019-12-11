import { computeExperienceOverYears, computeToolsExperienceRanking } from '../analysis/index.mjs'

export default {
    ToolsRankings: {
        experience: async (rankings, args, context, info) => {
            console.log(rankings)
            return computeToolsExperienceRanking(context.db, rankings.ids, rankings.survey)
        }
    },
    ToolExperience: {
        allYears: async (tool, args, context, info) => {
            return computeExperienceOverYears(context.db, tool.id, tool.survey)
        },
        year: async (tool, args, context, info) => {
            const allYears = await computeExperienceOverYears(context.db, tool.id, tool.survey)

            return allYears.find(yearItem => yearItem.year === args.year)
        }
    }
}
