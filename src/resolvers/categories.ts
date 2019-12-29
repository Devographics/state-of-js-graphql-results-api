import { Db } from 'mongodb'
import { computeHappinessByYear, computeTermAggregationByYear } from '../compute'
import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface CategoryConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeOtherTools = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        `sections_other_tools.${id}_normalized`,
        { filters }
    ])
}

export default {
    CategoryOtherTools: {
        allYears: async (
            { survey, id, filters }: CategoryConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return computeOtherTools(db, survey, id, filters)
        },
        year: async (
            { survey, id, filters }: CategoryConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherTools(db, survey, id, filters)

            return allYears.find(y => y.year === year)
        }
    },
    CategoryHappiness: {
        allYears: async (
            { survey, id, filters }: CategoryConfig,
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeHappinessByYear, db, [survey, id])
        },
        year: async (
            { survey, id, filters }: CategoryConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeHappinessByYear, db, [survey, id])

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
