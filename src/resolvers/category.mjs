import { computeHappinessByYear } from '../analysis/index.mjs'
import { loadYaml } from '../helpers.mjs'

const getMockData = category => {
    const mockData = loadYaml(`./src/mocks/${category}Heatmap.yml`)
    mockData.forEach(year => {
        year.buckets = year.buckets.map(tool => ({
            entity: getEntity(tool),
            ...tool
        }))
    })
    return mockData
}

export default {
    CategoryHappiness: {
        allYears: async (happiness, args, context, info) => {
            return computeHappinessByYear(context.db, happiness.id, happiness.survey)
        },
        year: async (happiness, args, context, info) => {
            const allYears = await computeHappinessByYear(
                context.db,
                happiness.id,
                happiness.survey
            )

            return allYears.find(yearItem => yearItem.year === args.year)
        }
    },
    CategoryHeatmap: {
        allYears: async (category, args, context, info) => {
            return getMockData(category.id)
        },
        year: async (category, { year }, context, info) => {
            const allYears = await computeExperienceOverYears(context.db, category.id)

            return getMockData().find(y => y.year === year)
        }
    }
}
