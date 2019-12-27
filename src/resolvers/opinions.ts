import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { RequestContext, SurveyConfig } from '../types'

export default {
    Opinion: {
        allYears: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [
                survey,
                `opinions.${id}`,
                { sort: 'id', order: 1 }
            ])
        },
        year: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                `opinions.${id}`,
                { sort: 'id', order: 1 }
            ])

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
