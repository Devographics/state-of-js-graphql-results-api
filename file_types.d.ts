declare module '*.graphql' {
    import { DocumentNode } from 'graphql'
    const Schema: DocumentNode

    export = Schema
}

/**
 * Define the type for the static features yaml file
 */
declare module '*features.yml' {
    interface FeatureData {
        id: string
        name: string
        mdn?: string
        caniuse?: string
    }
    const content: FeatureData[]

    export default content
}

declare module '*.yml' {
    const content: any
    export default content
}
