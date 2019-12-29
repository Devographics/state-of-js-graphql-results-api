import { Db } from 'mongodb'
import { computeExperienceOverYears, computeToolsExperienceRanking } from '../compute'
import { useCache } from '../caching'
import { SurveyConfig, RequestContext } from '../types'
import { Filters } from '../filters'

const computeToolExperience = async (db: Db, survey: SurveyConfig, id: string) => {
    return useCache(computeExperienceOverYears, db, [survey, id])
}

export default {
    ToolsRankings: {
        experience: async (
            { survey, ids, filters }: { survey: SurveyConfig; ids: string[]; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeToolsExperienceRanking, db, [survey, ids, filters])
        }
    },
    ToolExperience: {
        allYears: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            args: any,
            { db }: RequestContext
        ) => {
            return computeToolExperience(db, survey, id)
        },
        year: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeToolExperience(db, survey, id)

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
