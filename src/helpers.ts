import { EnumTypeDefinitionNode } from 'graphql'
import { Entity } from './types'
import entities from './data/entities.yml'
import projects from './data/projects.yml'
import typeDefs from './type_defs/schema.graphql'

const allEntities: Entity[] = [...projects, ...entities]

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
    id.includes('_others') ? `${id.replace('_others', '')}.others_normalized` : `${id}.choices`

export const getGraphQLEnumValues = (name: string) => {
    const enumDef = typeDefs.definitions.find(def => {
        return def.kind === 'EnumTypeDefinition' && def.name.value === name
    }) as EnumTypeDefinitionNode

    if (enumDef === undefined) {
        throw new Error(`No enum found matching name: ${name}`)
    }

    return enumDef.values!.map(v => v.name.value)
}
