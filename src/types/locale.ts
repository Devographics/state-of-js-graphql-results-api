export interface Locale {
    id: string
    locale: string
    label: string
    stringFiles: any[]
}

export interface StringFile {
    strings: string[]
    context: string
    prefix?: string
}
