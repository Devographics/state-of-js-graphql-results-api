import { GitHub } from './github'

export interface Entity {
    id: string
    aliases: string[]
    name: string
    homepage: string
    category: string
    description: string
    github?: GitHub
    npm?: string
}

export interface EntityBucket {
    id: string
    count: number
    percentage: number
    entity: Entity
}
