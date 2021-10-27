import { getGraphQLEnumValues, getDemographicsResolvers } from '../helpers'
import { getEntity } from '../entities'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import {
    computeToolExperienceGraph,
    computeToolsCardinalityByUser,
    ToolExperienceId
} from '../compute'
import { useCache } from '../caching'

const toolIds = getGraphQLEnumValues('ToolID')
const featureIds = getGraphQLEnumValues('FeatureID')

/**
 * Please maintain the same order as the one shown in the explorer,
 * it makes it easier to find a specific query and ensures consistency.
 */
export default {
    Survey: {
        surveyName: (survey: SurveyConfig) => {
            return survey.survey
        },
        bracketWins: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        }),
        bracketMatchups: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
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
        demographics: (survey: SurveyConfig) => ({
            participation: { survey },
            ...getDemographicsResolvers(survey)
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
        happiness: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        matrices: (survey: SurveyConfig) => ({
            survey
        }),
        opinion: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        opinions_others: (
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
        }),
        resources: (survey: SurveyConfig, { id, filters }: { id: string; filters?: Filters }) => ({
            survey,
            id,
            filters
        }),
        tool: async (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            id,
            entity: await getEntity({ id }),
            experience: ({ filters }: { filters?: Filters }) => ({
                survey,
                id,
                filters
            }),
            experienceGraph: async ({ filters }: { filters?: Filters }, { db }: RequestContext) =>
                useCache(computeToolExperienceGraph, db, [survey, id, filters])
        }),
        tools: async (survey: SurveyConfig, { ids = toolIds }: { ids?: string[] }) =>
            ids.map(async id => ({
                survey,
                id,
                entity: await getEntity({ id }),
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
        tools_cardinality_by_user: (
            survey: SurveyConfig,
            {
                year,
                // tool IDs
                ids,
                experienceId
            }: {
                year: number
                ids: string[]
                experienceId: ToolExperienceId
            },
            context: RequestContext
        ) => useCache(computeToolsCardinalityByUser, context.db, [survey, year, ids, experienceId]),
        tools_others: (
            survey: SurveyConfig,
            { id, filters }: { id: string; filters?: Filters }
        ) => ({
            survey,
            id,
            filters
        }),
        tools_rankings: (
            survey: SurveyConfig,
            { ids, filters }: { ids: string[]; filters: Filters }
        ) => ({
            survey,
            ids,
            filters
        }),
        totals: (survey: SurveyConfig) => survey
    }
}
