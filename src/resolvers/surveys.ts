import { EnumTypeDefinitionNode } from 'graphql'
import { getEntity } from '../helpers'
// import { getCategoryTools } from './category'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'
import typeDefs from '../type_defs/schema.graphql'

const getGraphQLEnumValues = (name: string) => {
    const enumDef = typeDefs.definitions.find(def => {
        return def.kind === 'EnumTypeDefinition' && def.name.value === name
    }) as EnumTypeDefinitionNode

    if (enumDef === undefined) {
        throw new Error(`No enum found matching name: ${name}`)
    }

    return enumDef.values!.map(v => v.name.value)
}

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
        opinion: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        otherTools: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id
        }),
        entity: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            ...getEntity({ id })
        }),
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
