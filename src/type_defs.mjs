import * as Apollo from 'apollo-server'
import { getEnum } from './helpers.mjs'
import path from 'path'
import fs from 'fs'

const loadGraphQL = file => fs.readFileSync(path.resolve(`./src/typedefs/${file}.graphql`), 'utf8')

const { gql } = Apollo.default

const typeDefs = /* GraphQL */ `

# Enums
enum SurveyType {
    ${getEnum('survey_type')}
}
enum ToolID {
    ${getEnum('tool')}
}
enum FeatureID {
    ${getEnum('feature')}
}
enum OpinionID {
    ${getEnum('opinion')}
}
enum OtherToolsID {
    ${getEnum('other-tools')}
}
enum ResourcesID {
    ${getEnum('resources')}
}
enum CategoryID {
    ${getEnum('categories')}
}

${loadGraphQL('surveys')}
${loadGraphQL('demographics')}
${loadGraphQL('features')}
${loadGraphQL('categories')}
${loadGraphQL('opinions')}
${loadGraphQL('othertools')}
${loadGraphQL('resources')}
${loadGraphQL('tools')}
${loadGraphQL('schema')}
`

export default gql(typeDefs)
