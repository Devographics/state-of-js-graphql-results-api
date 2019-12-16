import { getEntity, loadYaml } from '../helpers.mjs'
import { getCategoryTools } from './category.mjs'

const enums = loadYaml('./src/data/enums.yml')

export default {
    Survey: {
        demographics: (survey, args, context, info) => ({
            participation: { survey },
            country: { survey },
            source: { survey },
            gender: { survey },
            salary: { survey },
            companySize: { survey },
            workExperience: { survey },
            jobTitle: { survey },
            cssProficiency: { survey },
            backendProficiency: { survey }
        }),
        tool: async (survey, { id }, context, info) => ({
            survey,
            id,
            entity: getEntity({ id }),
            experience: {
                survey,
                id
            }
        }),
        tools: async (survey, { ids }, context, info) => {
            const toolIds = ids || enums.tool
            return toolIds.map(id => ({
                survey,
                id,
                entity: getEntity({ id }),
                experience: {
                    survey,
                    id
                }
            }))
        },
        toolsRankings: async (survey, { ids }, context, info) => {
            return {
                survey,
                ids
            }
        },
        feature: async (survey, { id }, context, info) => ({
            survey,
            id,
            experience: {
                survey,
                id
            }
        }),
        features: async (survey, { ids }, context, info) => {
            const featureIds = ids || enums.feature
            return featureIds.map(id => ({
                survey,
                id,
                experience: {
                    survey,
                    id
                }
            }))
        },
        opinion: async (survey, { id }, context, info) => {
            return {
                survey,
                id
            }
        },
        otherTools: async (survey, { id }, context, info) => {
            return {
                survey,
                id
            }
        },
        entity: async (survey, { id }, context, info) => {
            return {
                survey,
                ...getEntity({ id })
            }
        },
        resources: async (survey, { id }, context, info) => {
            return {
                survey,
                id
            }
        },
        matrices: async (survey, { id }, context, info) => {
            return {
                survey
            }
        },
        category: async (survey, { id }, context, info) => {
            return {
                survey,
                id,
                tools: {
                    survey,
                    id,
                    tools: getCategoryTools({ survey, id })
                },
                happiness: {
                    survey,
                    id
                },
                otherTools: {
                    survey,
                    id
                }
            }
        }
    }
}
