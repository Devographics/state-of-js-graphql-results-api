import { computeExperienceOverYears } from '../analysis/index.mjs'

export default {
    ToolExperience: {
        allYears: async (tool, args, context, info) => {
            return await computeExperienceOverYears(context.db, tool.id)
        },
        year: async (tool, args, context, info) => {
            const allYears = await computeExperienceOverYears(context.db, tool.id)
            return allYears.find(yearItem => yearItem.year === args.year)
        }
    }
}
