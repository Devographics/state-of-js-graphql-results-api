import { EnumTypeDefinitionNode } from 'graphql'
import typeDefs from './type_defs/schema.graphql'
import allEntities from './data/entities/index'
import { RequestContext, ResolverDynamicConfig, SurveyConfig } from './types'
import {
    computeTermAggregationAllYearsWithCache,
    computeTermAggregationSingleYearWithCache
} from './compute'
import { Filters } from './filters'

export const getEntities = ({ type, tag, tags }: { type?: string; tag?: string, tags?: string[] }) => {
    let entities = allEntities
    if (type) {
        entities = entities.filter(e => e.type === type)
    }
    if (tag) {
        entities = entities.filter(e => e.tags && e.tags.includes(tag))
    }
    if (tags) {
        entities = entities.filter(e => tags.every(t => e.tags && e.tags.includes(t)))
    }
    return entities
}

// Look up entities by id, name, or aliases (case-insensitive)
export const getEntity = ({ id }: { id: string }) => {
    if (!id || typeof id !== 'string') {
        return
    }

    const lowerCaseId = id.toLowerCase()
    const entity = allEntities.find(e => {
        return (
            (e.id && e.id.toLowerCase() === lowerCaseId) ||
            (e.id && e.id.toLowerCase().replace(/\-/g, '_') === lowerCaseId) ||
            (e.name && e.name.toLowerCase() === lowerCaseId) ||
            (e.aliases && e.aliases.find((a: string) => a.toLowerCase() === lowerCaseId))
        )
    })

    return entity || {}
}

/**
 * Return either e.g. other_tools.browsers.choices or other_tools.browsers.others_normalized
 */
export const getOtherKey = (id: string) =>
    id.includes('_others') ? `${id.replace('_others', '')}.others.normalized` : `${id}.choices`

export const getGraphQLEnumValues = (name: string): string[] => {
    const enumDef = typeDefs.definitions.find(def => {
        return def.kind === 'EnumTypeDefinition' && def.name.value === name
    }) as EnumTypeDefinitionNode

    if (enumDef === undefined) {
        throw new Error(`No enum found matching name: ${name}`)
    }

    return enumDef.values!.map(v => v.name.value)
}

/**
 * Get resolvers when the db key is the same as the field id
 *
 * @param id the field's GraphQL id
 * @param options options
 */
export const getStaticResolvers = (id: string, options: any = {}) => ({
    all_years: async (
        { survey, filters }: ResolverDynamicConfig,
        args: any,
        { db }: RequestContext
    ) => computeTermAggregationAllYearsWithCache(db, survey, id, { ...options, filters }),
    year: async (
        { survey, filters }: ResolverDynamicConfig,
        { year }: { year: number },
        { db }: RequestContext
    ) => computeTermAggregationSingleYearWithCache(db, survey, id, { ...options, filters, year })
})

/**
 * Get resolvers when the db key is *not* the same as the field id
 *
 * @param getId a function that takes the field's GraphQL id and returns the db key
 * @param options options
 */
export const getDynamicResolvers = (getId: (id: string) => string, options: any = {}) => ({
    all_years: async (
        { survey, id, filters }: ResolverDynamicConfig,
        args: any,
        { db }: RequestContext
    ) => computeTermAggregationAllYearsWithCache(db, survey, getId(id), { ...options, filters }),
    year: async (
        { survey, id, filters }: ResolverDynamicConfig,
        { year }: { year: number },
        { db }: RequestContext
    ) =>
        computeTermAggregationSingleYearWithCache(db, survey, getId(id), {
            ...options,
            filters,
            year
        })
})

const demographicsFields = [
    'country',
    'locale',
    'source',
    'gender',
    'race_ethnicity',
    'yearly_salary',
    'company_size',
    'years_of_experience',
    'job_title',
    'industry_sector',
    'industry_sector_others',
    'knowledge_score'
]

/**
 * Generic resolvers for passing down arguments for demographic fields
 *
 * @param survey current survey
 */
export const getDemographicsResolvers = (survey: SurveyConfig) => {
    const resolvers: any = {}
    demographicsFields.forEach(field => {
        resolvers[field] = ({ filters }: { filters: Filters }) => ({
            survey,
            filters
        })
    })
    return resolvers
}
