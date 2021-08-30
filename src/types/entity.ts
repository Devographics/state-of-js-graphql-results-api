import { GitHub } from './github'
import { MDN } from './mdn'

export interface Entity {
    id: string
    aliases?: string[]
    name: string
    otherName: string
    twitterName: string
    homepage?: string
    category?: string
    description?: string
    tags?: string[]
    match?: string[]
    github?: GitHub
    npm?: string
    type?: string
    mdn?: string
    patterns?: string[]
}

export interface EntityBucket {
    id: string
    count: number
    percentage: number
    entity: Entity
}
