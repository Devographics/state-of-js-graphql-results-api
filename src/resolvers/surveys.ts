import { getEntity } from '../helpers'
// import { getCategoryTools } from './category'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'

export default {
    Survey: {
        demographics: (survey: SurveyConfig) => ({
            participation: { survey },
            country: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            source: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            gender: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            salary: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            companySize: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            workExperience: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            jobTitle: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            cssProficiency: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            backendProficiency: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            })
        }),
        tool: async (survey: SurveyConfig, { id }: { id: string }) => {
            return {
                survey,
                id,
                entity: getEntity({ id }),
                experience: {
                    survey,
                    id
                }
            }
        },
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
        },
        category: async (survey: SurveyConfig, { id }: { id: string }) => {
            return {
                survey,
                id,
                /*
                tools: {
                    survey,
                    id,
                    tools: getCategoryTools({ survey, id })
                },
                */
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
