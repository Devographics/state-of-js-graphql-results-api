import { computeHappinessByYear } from '../analysis/index.mjs'

export default {
    years: async (happiness, args, context, info) => {
        return computeHappinessByYear(context.db, happiness.id)
    },
    year: async (happiness, args, context, info) => {
        const allYears = await computeHappinessByYear(context.db, happiness.id)

        return allYears.find(y => y.year === args.year)
    }
}
