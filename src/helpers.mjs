import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const entities = yaml.safeLoad(fs.readFileSync(path.resolve('./src/data/entities.yml'), 'utf8'))
const projects = yaml.safeLoad(fs.readFileSync(path.resolve('./src/data/projects.yml'), 'utf8'))

// Look up entities by id, name, or aliases (case-insensitive)
export const getEntity = ({ id }) => {
    const lowerCaseId = id.toLowerCase()
    const entity = [...entities, ...projects].find(e => {
        return (
            (e.id && e.id.toLowerCase() === lowerCaseId) ||
            (e.name && e.name.toLowerCase() === lowerCaseId) ||
            (e.aliases && e.aliases.find(a => a.toLowerCase() === lowerCaseId))
        )
    })
    return entity || {}
}
