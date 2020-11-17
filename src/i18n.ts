import { EnumTypeDefinitionNode } from 'graphql'
import { Entity, StringFile, Locale, TranslationString } from './types'
import entities from './data/entities/index'
import typeDefs from './type_defs/schema.graphql'
import locales from './i18n/'

// Look up entities by id, name, or aliases (case-insensitive)
export const getEntity = ({ id }: { id: string }) => {
    if (!id || typeof id !== 'string') {
        return
    }

    const lowerCaseId = id.toLowerCase()
    const entity = entities.find(e => {
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

    return { strings }
}

/*

Get locale strings with en-US strings as fallback

*/
export const getLocaleStringsWithFallback = (locale: Locale, contexts?: string[]) => {
    let localeStrings: TranslationString[] = [],
        translatedCount: number = 0,
        totalCount: number = 0,
        untranslatedKeys: string[] = []

    const enLocale = getValidLocale('en-US')
    if (enLocale) {
        const enStrings = getLocaleStrings(enLocale, contexts).strings

        // handle en-US locale separetely first
        if (locale.id === 'en-US') {
            return {
                strings: enStrings.map(t => ({ ...t, fallback: false })),
                translatedCount: enStrings.length,
                totalCount: enStrings.length,
                completion: 100,
                untranslatedKeys
            }
        }

        localeStrings = getLocaleStrings(locale, contexts).strings

        enStrings.forEach((enTranslation: TranslationString) => {
            totalCount++
            const localeTranslationIndex = localeStrings.findIndex(t => t.key === enTranslation.key)
            if (localeTranslationIndex === -1) {
                // en-US key doesn't exist in current locale file
                localeStrings.push({
                    ...enTranslation,
                    fallback: true
                })
                untranslatedKeys.push(enTranslation.key)
            } else if (localeStrings[localeTranslationIndex].t === enTranslation.t) {
                // current locale file's translation is same as en-US (untranslated)
                localeStrings[localeTranslationIndex].fallback = true
                untranslatedKeys.push(enTranslation.key)
            } else {
                // current locale has key, no fallback needed
                translatedCount++
                localeStrings[localeTranslationIndex].fallback = false
            }
        })
    }
    return {
        strings: localeStrings,
        translatedCount,
        totalCount,
        completion: Math.round((translatedCount * 100) / totalCount),
        untranslatedKeys
    }
}

/*

Get a specific locale with properly parsed strings

*/
export const getLocale = (localeId: string, contexts?: string[]) => {
    const validLocale = getValidLocale(localeId)
    if (!validLocale) {
        throw new Error(`No locale found for key ${localeId}`)
    }
    const localeData = getLocaleStringsWithFallback(validLocale, contexts)
    return {
        ...validLocale,
        ...localeData
    }
}

/*

Get all locales

*/
export const getLocales = (contexts?: string[]) => {
    return locales.map((locale: Locale) => getLocale(locale.id, contexts))
}

/*

Get a specific translation

Reverse array first so that strings added last take priority

*/
export const getTranslation = (key: string, localeId: string) => {
    const locale = getLocale(localeId)
    return locale.strings.reverse().find((s: any) => s.key === key)
}
