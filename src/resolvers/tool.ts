import { computeExperienceOverYears, computeToolsExperienceRanking } from '../compute'
import { useCache } from '../caching'
import { SurveyConfig, RequestContext } from '../types'
import { Filters } from '../filters'

export default {
    ToolsRankings: {
        experience: async (
            { survey, ids, filters }: { survey: SurveyConfig; ids: string[]; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeToolsExperienceRanking, db, [survey, ids, filters])
        }
    }
    /*
    ToolExperience: {
        allYears: async (tool, args, context) => {
            return useCache(computeExperienceOverYears, context.db, [
                tool.id,
                tool.survey
            ])
        },
        year: async (tool, args, context) => {
            const allYears = await useCache(computeExperienceOverYears, context.db, [
                tool.id,
                tool.survey
            ])

            return allYears.find(yearItem => yearItem.year === args.year)
        }
    }
    */
}
