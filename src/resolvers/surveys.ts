import { getEntity, getGraphQLEnumValues } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { computeToolExperienceGraph } from '../compute'
import { useCache } from '../caching'

const toolIds = getGraphQLEnumValues('ToolID')
const featureIds = getGraphQLEnumValues('FeatureID')

export default {
    Survey: {
        surveyName: (survey: SurveyConfig) => {
            return survey.survey
        },
        totals: (survey: SurveyConfig) => survey,
        demographics: (survey: SurveyConfig) => ({
            participation: { survey },
            country: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            locale: ({ filters }: { filters: Filters }) => ({
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
            race_ethnicity: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            yearly_salary: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            company_size: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            years_of_experience: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            }),
            job_title: ({ filters }: { filters: Filters }) => ({
                survey,
                filters
            })
        }),
        tool: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            entity: getEntity({ id }),
            experience: ({ filters }: { filters?: Filters }) => ({
                survey,
                id,
                filters
            }),
            experienceGraph: async ({ filters }: { filters?: Filters }, { db }: RequestContext) =>
                useCache(computeToolExperienceGraph, db, [survey, id, filters])
        }),
        tools: (survey: SurveyConfig, { ids = toolIds }: { ids?: string[] }) =>
            ids.map(id => ({
                survey,
                id,
                entity: getEntity({ id }),
                experience: ({ filters }: { filters?: Filters }) => ({
                    survey,
                    id,
                    filters
                }),
                experienceGraph: async (
                    { filters }: { filters?: Filters },
                    { db }: RequestContext
                ) => useCache(computeToolExperienceGraph, db, [survey, id, filters])
            })),
        tools_rankings: (
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
            experience: ({ filters }: { filters?: Filters }) => ({
                survey,
                id,
                filters
            })
        }),
        features: (survey: SurveyConfig, { ids = featureIds }: { ids: string[] }) =>
            ids.map(id => ({
                survey,
                id,
                experience: ({ filters }: { filters?: Filters }) => ({
                    survey,
                    id,
                    filters
                })
            })),
        features_others: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        }),
        opinion: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        opinions_others: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        tools_others: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
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
        }),
        environments: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        }),
        environments_ratings: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        }),
        proficiency: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        })
    }
}
