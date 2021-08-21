export interface Locale {
    id: string
    label: string
    stringFiles: any[]
    translators?: string[]
    repo: string
}

export interface StringFile {
    strings: TranslationString[]
    context: string
    prefix?: string
}

export interface TranslationString {
    key: string
    t: string
    context: string
    fallback: Boolean
}
