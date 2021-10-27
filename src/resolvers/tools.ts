import { Db } from 'mongodb'
import { computeExperienceOverYears, computeToolsExperienceRanking } from '../compute'
import { useCache } from '../caching'
import { SurveyConfig, RequestContext } from '../types'
import { Filters } from '../filters'
import { YearAggregations } from '../compute/generic'

interface ToolConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeToolExperience = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeExperienceOverYears, db, [survey, id, filters])

export default {
    ToolsRankings: {
        experience: async (
            { survey, ids, filters }: { survey: SurveyConfig; ids: string[]; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => useCache(computeToolsExperienceRanking, db, [survey, ids, filters])
    },
    ToolExperience: {
        all_years: async ({ survey, id, filters }: ToolConfig, args: any, { db }: RequestContext) =>
            computeToolExperience(db, survey, id, filters),
        year: async (
            { survey, id, filters }: ToolConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeToolExperience(db, survey, id, filters)
            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
