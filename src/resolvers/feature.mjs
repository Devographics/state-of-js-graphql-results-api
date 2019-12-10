import { computeFeatureUsageByYear } from '../analysis/index.mjs'

export default {
    FeatureExperience: {
        allYears: async (feature, args, context, info) => {
            return computeFeatureUsageByYear(context.db, feature.id, feature.survey)
        },
        year: async (feature, { year }, context, info) => {
            const allYears = await computeFeatureUsageByYear(context.db, feature.id, feature.survey)

            return allYears.find(y => y.year === year)
        }
    }
}
