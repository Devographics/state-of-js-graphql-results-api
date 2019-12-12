import fetch from 'node-fetch'

export const normalizeMdnResource = res => {
    return [res, ...res.translations].map(translation => {
        return {
            locale: translation.locale,
            url: translation.url,
            title: translation.title,
            summary: translation.summary
        }
    })
}

export const fetchMdnResource = async path => {
    try {
        const res = await fetch(`https://developer.mozilla.org${path}$json`)
        const json = await res.json()

        return normalizeMdnResource(json)
    } catch (error) {
        console.error(`an error occurred while fetching mdn resource`, error)
        throw error
    }
}
