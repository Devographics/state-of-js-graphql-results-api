import { loadYaml, getEntity } from '../helpers.mjs'
import { getCachedResult } from '../caching.mjs'

const getMockData = (type, subType, ids, year) => {
    const mockData = loadYaml(`./src/mocks/${subType}Heatmap.yml`)
    mockData.forEach(year => {
        year.buckets = year.buckets.map(tool => ({
            entity: getEntity(tool),
            ...tool
        }))
    })
    return mockData.find(d => d.year === year)
}

export default {
    Matrices: {
        tools: async (parent, { ids }, context, info) => {
            return { ...parent, ids, type: 'tools' }
        },
        features: async (parent, { ids }, context, info) => {
            return { ...parent, ids, type: 'features' }
        }
    },
    MatriceType: {
        workExperience: async (parent, args, context, info) => {
            return { ...parent, subType: 'workExperience' }
        },
        salary: async (parent, args, context, info) => {
            return { ...parent, subType: 'salary' }
        },
        companySize: async (parent, args, context, info) => {
            return { ...parent, subType: 'companySize' }
        }
    },
    Matrice: {
        year: async (parent, { year }, context, info) => {
            const { type, subType, ids } = parent
            return getMockData(type, subType, ids, year)
        }
    }
}
