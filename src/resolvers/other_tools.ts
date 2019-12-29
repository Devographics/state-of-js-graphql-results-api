import { Db } from 'mongodb'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface OtherToolsConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeOtherTools = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `other_tools.${getOtherKey(id)}`,
        { filters }
    ])

export default {
    OtherTools: {
        allYears: async (
            { survey, id, filters }: OtherToolsConfig,
            args: any,
            { db }: RequestContext
        ) => computeOtherTools(db, survey, id, filters),
        year: async (
            { survey, id, filters }: OtherToolsConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherTools(db, survey, id, filters)

            return allYears.find(y => y.year === year)
        }
    }
}
