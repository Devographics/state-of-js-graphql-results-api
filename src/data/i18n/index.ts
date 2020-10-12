import localesYAML from './locales.yml'

const locales: any = localesYAML

Object.keys(locales).forEach(l => {
  locales[l].stringFiles = []
})

function importAll(r: any) {
    r.keys().forEach((key: any) => (locales[key] = r(key)))
}

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
        const localeName = key.replace('./', '').replace('.yml', '');
        if (localeName === 'model') {
          // do nothing
        } else if (locales[localeName]) {
          locales[localeName].stringFiles.push({
            strings: req(key),
            context
          });
        } else {
          throw new Error(`Locale ${localeName} not declared in locales.yml`)
        }
    })
})

console.log('localesObject')
console.log(locales)

export default locales
