import { computeHappinessByYear, computeToolsExperience } from '../analysis/index.mjs'
import { getSurveyConfig, loadYaml, getEntity } from '../helpers.mjs'
import { getCachedResult } from '../caching.mjs'

export const getCategoryTools = category => {
    const survey = getSurveyConfig(category.survey.survey, category.survey.year)
    const categoryConfig = survey.categories[category.id]
    if (categoryConfig === undefined) {
        throw new Error(
            `Category ${category.id} is not defined for ${category.survey.survey}/${category.survey.year}`
        )
    }

    return categoryConfig.tools
}

export const getMockOtherTools = () => {
    const mockData = loadYaml('./src/mocks/otherTools.yml')
    mockData.forEach(year => {
        year.buckets = year.buckets.map(tool => ({
            entity: getEntity(tool),
            ...tool
        }))
    })
    return mockData
}

export default {
    CategoryTools: {
        experience: async (category, args, context, info) => {
            // use specified year if provided or fallback to survey year
            const year = args.year || category.survey.year

            const tools = await getCachedResult(computeToolsExperience, context.db, [
                category.tools,
                year,
                category.survey
            ])
            // const tools = await computeToolsExperience(
            //     context.db,
            //     category.tools,
            //     year,
            //     category.survey
            // )
            return {
                year,
                tools
            }
        }
    },
    CategoryOtherTools: {
        allYears: async (category, args, context, info) => {
            return getMockOtherTools()
            // return computeHappinessByYear(context.db, category.id, category.survey)
        },
        year: async (category, args, context, info) => {
            // const allYears = await computeHappinessByYear(
            //     context.db,
            //     category.id,
            //     category.survey
            // )
            const allYears = getMockOtherTools()
            return allYears.find(y => y.year === args.year)
        }
    },
    CategoryHappiness: {
        allYears: async (happiness, args, context, info) => {
            return await getCachedResult(computeHappinessByYear, context.db, [
                happiness.id,
                happiness.survey
            ])
            // return computeHappinessByYear(context.db, happiness.id, happiness.survey)
        },
        year: async (happiness, args, context, info) => {
            const allYears = await getCachedResult(computeHappinessByYear, context.db, [
                happiness.id,
                happiness.survey
            ])
            // const allYears = await computeHappinessByYear(
            //     context.db,
            //     happiness.id,
            //     happiness.survey
            // )

            return allYears.find(yearItem => yearItem.year === args.year)
        }
    }
    // CategoryHeatmap: {
    //     allYears: async (category, args, context, info) => {
    //         return getMockData(category.id)
    //     },
    //     year: async (category, { year }, context, info) => {
    //         console.log(category)
    //         // const allYears = await computeExperienceOverYears(context.db, category.id)
    //         return getMockData(category.id).find(y => y.year === year)
    //     }
    // }
}
