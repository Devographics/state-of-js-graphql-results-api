import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export const loadYaml = filePath => yaml.safeLoad(fs.readFileSync(path.resolve(filePath), 'utf8'))

const surveys = loadYaml('./src/data/surveys.yml')
const entities = loadYaml('./src/data/entities.yml')
const projects = loadYaml('./src/data/projects.yml')
const enums = loadYaml('./src/data/enums.yml')

const allEntities = [...entities, ...projects]

enums.entities = allEntities.map(e => e.id)

export const getSurveyConfig = (surveyType, year) => {
    const survey = surveys[surveyType]
    if (survey === undefined) {
        throw new Error(`Invalid survey type ${surveyType}`)
    }

    const surveyYear = survey[year]
    if (surveyYear === undefined) {
        throw new Error(`Year ${year} is not available for survey type ${surveyType}`)
    }

    return surveyYear
}

// Look up entities by id, name, or aliases (case-insensitive)
export const getEntity = ({ id }) => {
    const lowerCaseId = id.toLowerCase()
    const entity = allEntities.find(e => {
        return (
            (e.id && e.id.toLowerCase() === lowerCaseId) ||
            (e.id && e.id.toLowerCase().replace(/\-/g, '_') === lowerCaseId) ||
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
