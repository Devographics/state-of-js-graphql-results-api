import { Db } from 'mongodb'
import { computeHappinessByYear, computeTermAggregationByYear } from '../compute'
import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'
//import { computeToolsExperience } from '../compute'
//import { getSurveyConfig } from '../helpers'
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

const computeOtherTools = async (db: Db, survey: SurveyConfig, categoryId: string) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        `sections_other_tools.${categoryId}_normalized`
    ])
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
    */
    CategoryOtherTools: {
        allYears: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            args: any,
            { db }: RequestContext
        ) => {
            return computeOtherTools(db, survey, id)
        },
        year: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherTools(db, survey, id)

            return allYears.find(y => y.year === year)
        }
    },
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
