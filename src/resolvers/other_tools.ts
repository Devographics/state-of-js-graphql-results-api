import { Db } from 'mongodb'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'

const computeOtherTools = async (db: Db, survey: SurveyConfig, id: string) =>
    useCache(computeTermAggregationByYear, db, [survey, `other_tools.${getOtherKey(id)}`])

export default {
    OtherTools: {
        allYears: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            args: any,
            { db }: RequestContext
        ) => computeOtherTools(db, survey, id),
        year: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherTools(db, survey, id)

            return allYears.find(y => y.year === year)
        }
    }
}
