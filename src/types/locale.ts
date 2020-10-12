export interface Locale {
    id: string
    locale: string
    label: string
    stringFiles: any[]
    translators: string[]
}

export interface StringFile {
    strings: string[]
    context: string
    prefix?: string
}
