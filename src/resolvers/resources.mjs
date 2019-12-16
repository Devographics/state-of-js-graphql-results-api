import { getCachedResult } from '../caching.mjs'
import { computeEntityUsage } from '../analysis/index.mjs'

export default {
    allYears: async (parent, args, context, info) => {
        const sectionKey = parent.id.replace('_others', '')
        const allYears = await getCachedResult(computeEntityUsage, context.db, [`resources.${sectionKey}.others_normalized`])
        return allYears
    },
    year: async (parent, args, context, info) => {
        const sectionKey = parent.id.replace('_others', '')
        const allYears = await getCachedResult(computeEntityUsage, context.db, [`resources.${sectionKey}.others_normalized`])
        return allYears.find(y => y.year === args.year)
    }
}
