import { loadYaml, getEntity } from '../helpers.mjs'
import { getCachedResult } from '../caching.mjs'
import { computeToolsMatrix } from '../analysis/index.mjs'

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
            return { ...parent, subType: 'years_of_experience' }
        },
        salary: async (parent, args, context, info) => {
            return { ...parent, subType: 'yearly_salary' }
        },
        companySize: async (parent, args, context, info) => {
            return { ...parent, subType: 'company_size' }
        }
    },
    Matrice: {
        year: async (parent, { year }, context, info) => {
            if (parent.type === 'tools') {
                const matrix = await computeToolsMatrix(
                    context.db,
                    parent.ids,
                    'would_use',
                    parent.subType,
                    year,
                    parent.survey
                )

                return {
                    year,
                    buckets: matrix
                }
            }

            const { type, subType, ids } = parent
            return getMockData(type, subType, ids, year)
        }
    }
}
