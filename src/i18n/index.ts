import localesYAML from './locales.yml'
import { Locale } from '../types'

// initialize every locale with empty stringFiles array
const locales: Locale[] = localesYAML.map((l: any) => ({ ...l, stringFiles: [] }))

const localeDirectories: any = {
    'en-US': require.context('./en-US/', true, /\.yml$/),
    'es-ES': require.context('./es-ES/', true, /\.yml$/),
    'fr-FR': require.context('./fr-FR/', true, /\.yml$/),
    'hi-IN': require.context('./hi-IN/', true, /\.yml$/),
    'it-IT': require.context('./it-IT/', true, /\.yml$/),
    'pl-PL': require.context('./pl-PL/', true, /\.yml$/),
    'pt-PT': require.context('./pt-PT/', true, /\.yml$/),
    'ru-RU': require.context('./ru-RU/', true, /\.yml$/),
    'sv-SE': require.context('./sv-SE/', true, /\.yml$/),
    'zh-Hans': require.context('./zh-Hans/', true, /\.yml$/)
}

locales.forEach((locale: Locale) => {
    const req = localeDirectories[locale.id]
    if (!localeDirectories) {
        throw new Error(`No translation files directory found for locale ${locale.id}`)
    }
    req && req.keys().forEach((key: any) => {
        // context is one of homepage, results, state_of_css, etc.
        const context = key.replace('./', '').replace('.yml', '')
        try {
            const file = req(key)
            locale.stringFiles.push({
                strings: file.translations,
                context
            })
        } catch (error) {
            console.log(error)
            throw new Error(`Error loading file ${locale.id}/${key}`)
        }
    })
})

export default locales

