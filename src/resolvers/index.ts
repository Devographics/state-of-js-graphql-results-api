import demographics from './demographics'
import surveys from './surveys'
import opinions from './opinions'
import features from './features'
import matrices from './matrices'
import categories from './categories'
import tools from './tools'
import otherFeatures from './other_features'
import otherTools from './other_tools'
import resources from './resources'
import entities from './entities'
import query from './query'
import environments from './environments'

export default {
    ...surveys,
    ...demographics,
    ...categories,
    ...opinions,
    ...features,
    ...matrices,
    ...tools,
    ...otherFeatures,
    ...otherTools,
    ...resources,
    ...entities,
    ...environments,
    ...query
}
