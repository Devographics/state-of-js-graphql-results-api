import { computeOpinionByYear } from '../analysis/index.mjs'

export default {
    allYears: async (opinion, args, context, info) => {
        return await computeOpinionByYear(context.db, opinion.id)
    },
    year: async (opinion, args, context, info) => {
        const allYears = await computeOpinionByYear(context.db, opinion.id)
        return allYears.find(yearItem => yearItem.year === args.year)
    }
}
