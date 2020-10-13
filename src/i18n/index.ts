import localesYAML from './locales.yml'

const locales: any = localesYAML

Object.keys(locales).forEach(l => {
    // initialize every locale with empty stringFiles array
    locales[l].stringFiles = []
})

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
        const localeName = key.replace('./', '').replace('.yml', '')
        if (localeName === 'model') {
            // do nothing
        } else if (locales[localeName]) {
            try {
                const file = req(key)

                locales[localeName].stringFiles.push({
                    strings: file.translations,
                    context
                })
            } catch (error) {
                console.log(error)
                throw new Error(`Error loading file ${context}/${key}`)
            }
        } else {
            console.warn(`Locale ${localeName} not declared in locales.yml, skipping file`)
        }
    })
})

export default locales
