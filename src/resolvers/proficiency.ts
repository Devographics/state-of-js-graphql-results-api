import { Db } from 'mongodb'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface ProficiencyConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeProficiency = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `user_info.${id}`,
        { filters, sort: 'id', order: 1 }
    ])

export default {
    Proficiency: {
        all_years: async (
            { survey, id, filters }: ProficiencyConfig,
            args: any,
            { db }: RequestContext
        ) => computeProficiency(db, survey, id, filters),
        year: async (
            { survey, id, filters }: ProficiencyConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeProficiency(db, survey, id, filters)

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
