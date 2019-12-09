import Demographics from './resolvers/demographics.mjs'
import Feature from './resolvers/feature.mjs'
import Happiness from './resolvers/happiness.mjs'
import Opinion from './resolvers/opinion.mjs'
import OtherTools from './resolvers/othertools.mjs'
import Query from './resolvers/query.mjs'
import Resources from './resolvers/resources.mjs'
import Tool from './resolvers/tool.mjs'

export default {
    ...Demographics,
    Query,
    Tool,
    Feature,
    Opinion,
    OtherTools,
    Resources,
    Happiness
}
