import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const entities = yaml.safeLoad(fs.readFileSync(path.resolve('./src/data/entities.yml'), 'utf8'))
const projects = yaml.safeLoad(fs.readFileSync(path.resolve('./src/data/projects.yml'), 'utf8'))
const enums = yaml.safeLoad(fs.readFileSync(path.resolve('./src/data/enums.yml'), 'utf8'))

const allEntities = [...entities, ...projects]

enums.entities = allEntities.map(e => e.id)

// Look up entities by id, name, or aliases (case-insensitive)
export const getEntity = ({ id }) => {
    const lowerCaseId = id.toLowerCase()
    const entity = allEntities.find(e => {
        return (
            (e.id && e.id.toLowerCase() === lowerCaseId) ||
            (e.name && e.name.toLowerCase() === lowerCaseId) ||
            (e.aliases && e.aliases.find(a => a.toLowerCase() === lowerCaseId))
        )
    })
    return entity || {}
}

export const getEnum = type => {
    if (enums[type]) {
        return enums[type].join('\n') || ''
    } else {
        throw new Error(`No Enum of type ${type}.`)
    }
}
