import { computeExperienceOverYears } from '../analysis/index.mjs'

export default {
    experience: async (tool, args, context, info) => {
        return computeExperienceOverYears(context.db, tool.id)
    }
}
