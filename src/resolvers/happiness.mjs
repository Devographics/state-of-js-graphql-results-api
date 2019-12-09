import { computeHappinessByYear } from '../analysis/index.mjs'

export default {
    allYears: async (happiness, args, context, info) => {
        return computeHappinessByYear(context.db, happiness.id)
    },
    year: async (happiness, args, context, info) => {
        const allYears = await computeHappinessByYear(context.db, happiness.id)
        return allYears.find(yearItem => yearItem.year === args.year)
    }
}
