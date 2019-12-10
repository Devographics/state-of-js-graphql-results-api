import { computeExperienceOverYears } from '../analysis/index.mjs'

export default {
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
