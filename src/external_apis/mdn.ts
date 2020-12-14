import fetch from 'node-fetch'

interface TranslatedMDNInfo {
    locale: string
    title: string
    summary: string
    url: string
}

interface MDNInfo extends TranslatedMDNInfo {
    translations: TranslatedMDNInfo[]
}

export const normalizeMdnResource = (res: MDNInfo): TranslatedMDNInfo[] => {
    return [res, ...res.translations].map(translation => {
        return {
            locale: translation.locale,
            title: translation.title,
            summary: translation.summary,
            url: translation.url
        }
    })
}

export const fetchMdnResource = async (path: string) => {
    try {
        const res = await fetch(`https://developer.mozilla.org${path}$json`)
        const json: MDNInfo = await res.json()

        return normalizeMdnResource(json)
    } catch (error) {
        console.error(`an error occurred while fetching mdn resource`, error)
        // throw error
        return
    }
}
