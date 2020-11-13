import { Db } from 'mongodb'
import { computeHappinessByYear, computeTermAggregationByYear } from '../compute'
import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface HappinessConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

export default {
    Happiness: {
        all_years: async (
            { survey, id, filters }: HappinessConfig,
            args: any,
            { db }: RequestContext
        ) => useCache(computeHappinessByYear, db, [survey, id, filters]),
        year: async (
            { survey, id, filters }: HappinessConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeHappinessByYear, db, [survey, id, filters])
            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
