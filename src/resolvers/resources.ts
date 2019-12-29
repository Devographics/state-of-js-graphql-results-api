import { Db } from 'mongodb'
import { useCache } from '../caching'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'

const computeResource = async (db: Db, survey: SurveyConfig, id: string) => {
    return useCache(computeTermAggregationByYear, db, [survey, `resources.${getOtherKey(id)}`])
}

export default {
    Resources: {
        allYears: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            args: any,
            { db }: RequestContext
        ) => {
            return computeResource(db, survey, id)
        },
        year: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeResource(db, survey, id)

            return allYears.find(y => y.year === year)
        }
    }
}
