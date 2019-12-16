import { computeExperienceOverYears, computeToolsExperienceRanking } from '../analysis/index.mjs'
import { getCachedResult } from '../caching.mjs'

export default {
    ToolsRankings: {
        experience: async (rankings, args, context, info) => {
            return await getCachedResult(computeToolsExperienceRanking, context.db, [rankings.ids, rankings.survey])
        }
    },
    ToolExperience: {
        allYears: async (tool, args, context, info) => {
            // return await computeExperienceOverYears(context.db, tool.id, tool.survey)

            return await getCachedResult(computeExperienceOverYears, context.db, [tool.id, tool.survey])
        },
        year: async (tool, args, context, info) => {
            // const allYears = await computeExperienceOverYears(context.db, tool.id, tool.survey)
            const allYears = await getCachedResult(computeExperienceOverYears, context.db, [tool.id, tool.survey])

            return allYears.find(yearItem => yearItem.year === args.year)
        }
    }
}
