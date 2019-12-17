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
    ToolsMatrices: {
        workExperience: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'years_of_experience' }
        },
        salary: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'yearly_salary' }
        },
        companySize: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'company_size' }
        }
    },
    ToolsMatrice: {
        year: async (parent, { year }, context, info) => {
            console.log({ ...parent, year })
            if (parent.type === 'tools') {
                /*
                survey: { survey: 'js', year: 2019 },
                  ids: [ 'redux', 'apollo', 'graphql', 'relay', 'mobx' ],
                  type: 'tools',
                  experience: 'would_use',
                  subType: 'years_of_experience',
                  year: 2019
                 */
                const matrix = await computeToolsMatrix(
                    context.db,
                    { ...parent, year }
                )

                return {
                    year,
                    experience: parent.experience,
                    buckets: matrix
                }
            }

            const { type, subType, ids } = parent
            return getMockData(type, subType, ids, year)
        }
    },
    FeaturesMatrices: {
        workExperience: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'years_of_experience' }
        },
        salary: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'yearly_salary' }
        },
        companySize: async (parent, args, context, info) => {
            return { ...parent, ...args, subType: 'company_size' }
        }
    },
    FeaturesMatrice: {
        year: async (parent, { year }, context, info) => {
            console.log({ parent, year })
        }
    }
}
