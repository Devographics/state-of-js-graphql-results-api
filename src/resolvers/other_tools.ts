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

const computeOtherTools = async (
    db: Db,
    survey: SurveyConfig,
    id: string,
    filters?: Filters,
    year?: number
) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `tools_others.${getOtherKey(id)}`,
        { filters },
        year
    ])

export default {
    OtherTools: {
        all_years: async (
            { survey, id, filters }: OtherToolsConfig,
            args: any,
            { db }: RequestContext
        ) => computeOtherTools(db, survey, id, filters),
        year: async (
            { survey, id, filters }: OtherToolsConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const oneYear = await computeOtherTools(db, survey, id, filters, year)
            return oneYear[0]
        }
    }
}
