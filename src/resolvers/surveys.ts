// import { getEntity, loadYaml } from '../helpers'
// import { getCategoryTools } from './category'
import { SurveyConfig } from '../types'
// const enums = loadYaml('./src/data/enums.yml')

export default {
    Survey: {
        demographics: (survey: SurveyConfig) => ({
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
        // tool: async (survey, { id }, context, info) => ({
        //     survey,
        //     id,
        //     entity: getEntity({ id }),
        //     experience: {
        //         survey,
        //         id
        //     }
        // }),
        // tools: async (survey, { ids }, context, info) => {
        //     const toolIds = ids || enums.tool
        //     return toolIds.map(id => ({
        //         survey,
        //         id,
        //         entity: getEntity({ id }),
        //         experience: {
        //             survey,
        //             id
        //         }
        //     }))
        // },
        toolsRankings: async (survey: SurveyConfig, { ids }: { ids: string[] }) => {
            return {
                survey,
                ids
            }
        },
        feature: async (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            experience: {
                survey,
                id
            }
        }),
        // features: async (survey, { ids }, context, info) => {
        //     const featureIds = ids || enums.feature
        //     return featureIds.map(id => ({
        //         survey,
        //         id,
        //         experience: {
        //             survey,
        //             id
        //         }
        //     }))
        // },
        opinion: async (survey: SurveyConfig, { id }: { id: string }) => {
            console.log('OPINION')
            return {
                survey,
                id
            }
        },
        otherTools: async (survey: SurveyConfig, { id }: { id: string }) => {
            return {
                survey,
                id
            }
        },
        // entity: async (survey, { id }, context, info) => {
        //     return {
        //         survey,
        //         ...getEntity({ id })
        //     }
        // },
        resources: async (survey: SurveyConfig, { id }: { id: string }) => {
            return {
                survey,
                id
            }
        },
        matrices: async (survey: SurveyConfig) => {
            return {
                survey
            }
        }
        // category: async (survey, { id }, context, info) => {
        //     return {
        //         survey,
        //         id,
        //         tools: {
        //             survey,
        //             id,
        //             tools: getCategoryTools({ survey, id })
        //         },
        //         happiness: {
        //             survey,
        //             id
        //         },
        //         otherTools: {
        //             survey,
        //             id
        //         }
        //     }
        // }
    }
}
