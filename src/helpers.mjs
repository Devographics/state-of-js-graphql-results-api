import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

const entities = yaml.safeLoad(fs.readFileSync(path.resolve('./src/entities.yml'), 'utf8'))

// Look up entities by id, name, or aliases
export const getEntity = ({ id }) => {
  const entity = entities.find(e => {
    return e.id === id || e.name === id || e.aliases && e.aliases.includes(id)
  })
  return entity || {}
}