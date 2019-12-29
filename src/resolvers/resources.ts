import { Db } from 'mongodb'
import { useCache } from '../caching'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'
import { Filters } from '../filters'

interface ResourceConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeResource = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `resources.${getOtherKey(id)}`,
        { filters }
    ])

export default {
    Resources: {
        allYears: async (
            { survey, id, filters }: ResourceConfig,
            args: any,
            { db }: RequestContext
        ) => computeResource(db, survey, id, filters),
        year: async (
            { survey, id, filters }: ResourceConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeResource(db, survey, id, filters)

            return allYears.find(y => y.year === year)
        }
    }
}
