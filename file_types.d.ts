declare module '*.graphql' {
    import { DocumentNode } from 'graphql'
    const Schema: DocumentNode

    export = Schema
}

declare module '*.yml' {
    const content: any
    export default content
}
