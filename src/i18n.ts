import { EnumTypeDefinitionNode } from 'graphql'
import { Entity, StringFile, Locale } from './types'
import entities from './data/entities.yml'
import projects from './data/projects.yml'
import typeDefs from './type_defs/schema.graphql'
import locales from './i18n/'

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

export const getGraphQLEnumValues = (name: string): string[] => {
    const enumDef = typeDefs.definitions.find(def => {
        return def.kind === 'EnumTypeDefinition' && def.name.value === name
    }) as EnumTypeDefinitionNode

    if (enumDef === undefined) {
        throw new Error(`No enum found matching name: ${name}`)
    }

    return enumDef.values!.map(v => v.name.value)
}

/*

For a given locale id, get closest existing key.

Ex: 

en-US -> en-US
en-us -> en-US
en-gb -> en-US
etc. 

*/
export const truncateKey = (key: string) => key.split('-')[0]

export const getValidLocale = (localeId: string) => {
    const validLocale = locales.find((locale: Locale) => {
        const { id } = locale
        return (
            id.toLowerCase() === localeId.toLowerCase() || truncateKey(id) === truncateKey(localeId)
        )
    })
    return validLocale
}


/*

Get locale strings for a specific locale

*/
export const getLocaleStrings = (locale: Locale, contexts?: string[]) => {
    let stringFiles = locale.stringFiles

    // if contexts are specified, filter strings by them
    if (contexts) {
        stringFiles = stringFiles.filter((sf: StringFile) => {
            return contexts.includes(sf.context)
        })
    }

    // flatten all stringFiles together
    const strings = stringFiles
        .map((sf: StringFile) => {
            let { strings, prefix, context } = sf
            // if strings need to be prefixed, do it now
            if (prefix) {
                strings = strings.map((s: any) => ({ ...s, key: `${prefix}.${s.key}` }))
            }
            // add context to all strings just in case
            strings = strings.map((s: any) => ({ ...s, context }))
            return strings
        })
        .flat()

    return strings
}

/*

Get a specific locale with properly parsed strings

*/
export const getLocale = (localeId: string, contexts?: string[]) => {
    const validLocale = getValidLocale(localeId)
    if (!validLocale) {
        throw new Error(`No locale found for key ${localeId}`)
    }
    const strings = getLocaleStrings(validLocale, contexts)
    return {
        ...validLocale,
        strings
    }
}

/*

Get all locales

*/
export const getLocales = () => {
    return locales.map((locale: Locale) => getLocale(locale.id))
}

/*

Get a specific translation

*/
export const getTranslation = (key: string, localeId: string) => {
    const locale = getLocale(localeId)
    return locale.strings.find((s: any) => s.key === key)
}
