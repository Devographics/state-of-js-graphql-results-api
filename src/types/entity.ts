import { GitHub } from './github'

export interface Entity {
    id: string
    name: string
    homepage: string
    category: string
    github: GitHub
    npm: string
    description: string
}

export interface EntityBucket {
    id: string
    count: number
    percentage: number
    entity: Entity
}
