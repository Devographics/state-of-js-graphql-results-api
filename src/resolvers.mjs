import Surveys from './resolvers/surveys.mjs'
import Demographics from './resolvers/demographics.mjs'
import Feature from './resolvers/feature.mjs'
import Category from './resolvers/category.mjs'
import Opinion from './resolvers/opinion.mjs'
import OtherTools from './resolvers/othertools.mjs'
import Query from './resolvers/query.mjs'
import Resources from './resolvers/resources.mjs'
import Tool from './resolvers/tool.mjs'
import Entity from './resolvers/entity.mjs'
import Matrices from './resolvers/matrices.mjs'

export default {
    ...Surveys,
    ...Demographics,
    ...Tool,
    ...Feature,
    ...Category,
    ...Matrices,
    Entity,
    Opinion,
    OtherTools,
    Resources,
    Query
}
