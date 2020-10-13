import { EnumTypeDefinitionNode } from 'graphql'
import { Entity } from './types'
import entities from './data/entities.yml'
import projects from './data/projects.yml'
import typeDefs from './type_defs/schema.graphql'
import features from './data/features.yml'

const allEntities: Entity[] = [...projects, ...entities]

export const getEntities = ({
    type,
    context,
    tag
}: {
    type: string
    context: string
    tag: string
}) => {
    let allEntities = [
        entities.map((e: Entity) => ({ ...e, type: 'entity' })),
        // projects.map(e => ({ ...e, type: 'project' })),
        features.map(e => ({ ...e, type: 'feature' }))
    ].flat()

    if (type) {
        allEntities = allEntities.filter(e => e.type === type)
    }
    if (context) {
        allEntities = allEntities.filter(e => e.context === context)
    }
    if (tag) {
        allEntities = allEntities.filter(e => e.tags && e.tags.includes(tag))
    }
    return allEntities
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
