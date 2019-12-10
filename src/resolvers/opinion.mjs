import { computeOpinionByYear } from '../analysis/index.mjs'

export default {
    allYears: async (opinion, args, context, info) => {
        return computeOpinionByYear(context.db, opinion.id, opinion.survey)
    },
    year: async (opinion, args, context, info) => {
        const allYears = await computeOpinionByYear(context.db, opinion.id, opinion.survey)

        return allYears.find(yearItem => yearItem.year === args.year)
    }
}
