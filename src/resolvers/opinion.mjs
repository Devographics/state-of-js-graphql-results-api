import { computeOpinionByYear } from '../analysis/index.mjs'

export default {
    byYear: async (opinion, args, context, info) => {
        return computeOpinionByYear(context.db, opinion.id)
    },
    year: async (opinion, args, context, info) => {
        const allYears = await computeOpinionByYear(context.db, opinion.id)

        return allYears.find(y => y.year === args.year)
    }
}
