import { getEntity, getGraphQLEnumValues } from '../helpers'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'

const toolIds = getGraphQLEnumValues('ToolID')
const featureIds = getGraphQLEnumValues('FeatureID')

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
        tools: (survey: SurveyConfig, { ids = toolIds }: { ids?: string[] }) => {
            return ids.map(id => ({
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
        features: (survey: SurveyConfig, { ids = featureIds }: { ids: string[] }) => {
            return ids.map(id => ({
                survey,
                id,
                experience: {
                    survey,
                    id
                }
            }))
        },
        opinion: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        otherTools: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        entity: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            ...getEntity({ id })
        }),
        resources: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        matrices: (survey: SurveyConfig) => ({
            survey
        }),
        category: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            happiness: ({ filters }: { filters: Filters }) => ({
                survey,
                id,
                filters
            }),
            otherTools: ({ filters }: { filters: Filters }) => ({
                survey,
                id,
                filters
            })
        })
    }
}
