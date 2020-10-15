import localesYAML from './locales.yml'
import { Locale } from '../types'

// initialize every locale with empty stringFiles array
const locales: Locale[] = localesYAML.map((l: any) => ({...l, stringFiles: []}))

const contexts: any = {
    common: require.context('./common/', true, /\.yml$/),
    homepage: require.context('./homepage/', true, /\.yml$/),
    results: require.context('./results/', true, /\.yml$/),
    state_of_css: require.context('./state_of_css/', true, /\.yml$/),
    state_of_js: require.context('./state_of_js/', true, /\.yml$/)
}

Object.keys(contexts).forEach(context => {
    const req = contexts[context]
    req.keys().forEach((key: any) => {
        const fileName = key.replace('./', '').replace('.yml', '')
        if (fileName === 'model') {
            // do nothing
        } else {
            const locale = locales.find(l => l.id === fileName)
            if (locale) {
                try {
                    const file = req(key)
                    locale.stringFiles.push({
                        strings: file.translations,
                        context
                    })
                } catch (error) {
                    console.log(error)
                    throw new Error(`Error loading file ${context}/${key}`)
                }
            } else {
                console.warn(`Locale ${fileName} not found in locales.yml, skipping file`)
            }
        }
    })
})

export default locales
