//import { computeHappinessByYear, computeToolsExperience, computeEntityUsage } from '../compute'
import { computeHappinessByYear } from '../compute'
//import { getSurveyConfig } from '../helpers'
import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'
/*
export const getCategoryTools = (category: {
    id: string
    survey: { survey: string; year: number }
}) => {
    const survey = getSurveyConfig(category.survey.survey, category.survey.year)
    const categoryConfig = survey.categories[category.id]
    if (categoryConfig === undefined) {
        throw new Error(
            `Category ${category.id} is not defined for ${category.survey.survey}/${category.survey.year}`
        )
    }

    return categoryConfig.tools
}
*/

interface CategoryConfig {
    survey: SurveyConfig
    id: string
}

export default {
    /*
    CategoryTools: {
        experience: async (category, args, context) => {
            // use specified year if provided or fallback to survey year
            const year = args.year || category.survey.year

            const tools = await getCachedResult(computeToolsExperience, context.db, [
                category.tools,
                year,
                category.survey
            ])

            return {
                year,
                tools
            }
        }
    },
    CategoryOtherTools: {
        allYears: async (category, args, context) => {
            const allYears = await getCachedResult(computeEntityUsage, context.db, [
                `sections_other_tools.${category.id}_normalized`
            ])

            return allYears
        },
        year: async (category, args, context, info) => {
            const allYears = await getCachedResult(
                computeEntityUsage,
                context.db,
                [`sections_other_tools.${category.id}_normalized`],
                false
            )

            return allYears.find(y => y.year === args.year)
        }
    },
    */
    CategoryHappiness: {
        allYears: async (category: CategoryConfig, args: any, { db }: RequestContext) => {
            return useCache(computeHappinessByYear, db, [category.survey, category.id])
        },
        year: async (
            category: CategoryConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeHappinessByYear, db, [
                category.survey,
                category.id
            ])

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
