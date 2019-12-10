import { computeHappinessByYear } from '../analysis/index.mjs'

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
            return computeHappinessByYear(context.db, happiness.id)
        },
        year: async (happiness, args, context, info) => {
            const allYears = await computeHappinessByYear(context.db, happiness.id)
            return allYears.find(yearItem => yearItem.year === args.year)
        }
    },
    CategoryHeatmap: {
        allYears: async (category, args, context, info) => {
            console.log(category)
            return getMockData()
        },
        year: async (category, { year }, context, info) => {
            console.log(category)
            const allYears = await computeExperienceOverYears(context.db, tool.id)
            return getMockData().find(y => y.year === year)
        }
    }
}
