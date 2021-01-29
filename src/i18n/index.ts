import localesYAML from './locales.yml'
import { Locale } from '../types'

// initialize every locale with empty stringFiles array
const locales: Locale[] = localesYAML.map((l: any) => ({ ...l, stringFiles: [] }))

const localeDirectories: any = {
    'ca-ES': require.context('./ca-ES/', true, /\.yml$/),
    'cs-CZ': require.context('./cs-CZ/', true, /\.yml$/),
    'de-DE': require.context('./de-DE/', true, /\.yml$/),
    'en-US': require.context('./en-US/', true, /\.yml$/),
    'es-ES': require.context('./es-ES/', true, /\.yml$/),
    'fa-IR': require.context('./fa-IR/', true, /\.yml$/),
    'fr-FR': require.context('./fr-FR/', true, /\.yml$/),
    'gl-ES': require.context('./gl-ES/', true, /\.yml$/),
    'hi-IN': require.context('./hi-IN/', true, /\.yml$/),
    'id-ID': require.context('./id-ID/', true, /\.yml$/),
    'it-IT': require.context('./it-IT/', true, /\.yml$/),
    'ja-JP': require.context('./ja-JP/', true, /\.yml$/),
    'ko-KR': require.context('./ko-KR/', true, /\.yml$/),
    'pl-PL': require.context('./pl-PL/', true, /\.yml$/),
    'pt-PT': require.context('./pt-PT/', true, /\.yml$/),
    'ru-RU': require.context('./ru-RU/', true, /\.yml$/),
    'ua-UA': require.context('./ua-UA/', true, /\.yml$/),
    'sv-SE': require.context('./sv-SE/', true, /\.yml$/),
    'tr-TR': require.context('./tr-TR/', true, /\.yml$/),
    'zh-Hans': require.context('./zh-Hans/', true, /\.yml$/),
    'zh-Hant': require.context('./zh-Hant/', true, /\.yml$/),
    'ro-RO': require.context('./ro-RO/', true, /\.yml$/),
}

locales.forEach((locale: Locale) => {
    const req = localeDirectories[locale.id]
    if (!localeDirectories) {
        throw new Error(`No translation files directory found for locale ${locale.id}`)
    }
    req &&
        req.keys().forEach((key: any) => {
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
