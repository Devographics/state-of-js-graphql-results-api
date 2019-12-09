import { computeFeatureUsageByYear } from '../analysis/index.mjs'

export default {
    allYears: async (feature, args, context, info) => {
        return await computeFeatureUsageByYear(context.db, feature.section, feature.id)
    },
    year: async (feature, args, context, info) => {
        const allYears = await computeFeatureUsageByYear(context.db, feature.section, feature.id)
        return allYears.find(yearItem => yearItem.year === args.year)
    }
}
