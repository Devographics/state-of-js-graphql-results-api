import { computeOpinionByYear } from '../analysis/index.mjs'
import { getCachedResult } from '../caching.mjs'

export default {
    allYears: async (opinion, args, context, info) => {
        return await getCachedResult(computeOpinionByYear, context.db, [opinion.id, opinion.survey])
        // return computeOpinionByYear(context.db, opinion.id, opinion.survey)
    },
    year: async (opinion, args, context, info) => {
        const allYears = await getCachedResult(computeOpinionByYear, context.db, [opinion.id, opinion.survey])
        // const allYears = await computeOpinionByYear(context.db, opinion.id, opinion.survey)

        return allYears.find(yearItem => yearItem.year === args.year)
    }
}
