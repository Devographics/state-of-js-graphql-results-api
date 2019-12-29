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
        tool: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            entity: getEntity({ id }),
            experience: {
                survey,
                id
            }
        }),
        tools: (survey: SurveyConfig, { ids }: { ids?: string[] }) => {
            const toolIds = ids || [] // enums.tool

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
        toolsRankings: (
            survey: SurveyConfig,
            { ids, filters }: { ids: string[]; filters: Filters }
        ) => ({
            survey,
            ids,
            filters
        }),
        feature: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            experience: {
                survey,
                id
            }
        }),
        // features: (survey, { ids }, context, info) => {
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
        opinion: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        otherTools: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        // entity: (survey, { id }, context, info) => {
        //     return {
        //         survey,
        //         ...getEntity({ id })
        //     }
        // },
        resources: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        matrices: (survey: SurveyConfig) => ({
            survey
        }),
        category: (survey: SurveyConfig, { id }: { id: string }) => ({
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
        })
    }
}
