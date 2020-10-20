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

const computeOtherTools = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `tools_others.${id}.others.normalized`,
        { filters }
    ])

export default {
    CategoryOtherTools: {
        all_years: async (
            { survey, id, filters }: CategoryConfig,
            args: any,
            { db }: RequestContext
        ) => computeOtherTools(db, survey, id, filters),
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
        all_years: async (
            { survey, id, filters }: CategoryConfig,
            args: any,
            { db }: RequestContext
        ) => useCache(computeHappinessByYear, db, [survey, id, filters]),
        year: async (
            { survey, id, filters }: CategoryConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeHappinessByYear, db, [survey, id, filters])

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
