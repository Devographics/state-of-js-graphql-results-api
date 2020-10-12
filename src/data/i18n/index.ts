import localesYAML from './locales.yml'
import projects from '../projects.yml'
import features from '../features.yml'
import entities from '../entities.yml'

const allEntities: any = { projects, features, entities }
const locales: any = localesYAML

const convertToStrings = (file: any) => file.map((item: any) => ({ key: item.id, t: item.name }))

Object.keys(locales).forEach(l => {
    // initialize every locale with projects, entities, and features
    locales[l].stringFiles = Object.keys(allEntities).map(e => ({
        context: e,
        strings: convertToStrings(allEntities[e])
    }))
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
            locales[localeName].stringFiles.push({
                strings: req(key),
                context
            })
        } else {
            throw new Error(`Locale ${localeName} not declared in locales.yml`)
        }
    })
})

console.log('localesObject')
console.log(locales)

export default locales
