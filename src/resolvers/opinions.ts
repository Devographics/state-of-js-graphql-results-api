import { Db } from 'mongodb'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { RequestContext, SurveyConfig } from '../types'

const computeOpinion = async (db: Db, survey: SurveyConfig, id: string) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        `opinions.${id}`,
        { sort: 'id', order: 1 }
    ])
}

export default {
    Opinion: {
        allYears: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return computeOpinion(db, survey, id)
        },
        year: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOpinion(db, survey, id)

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
