import demographics from './demographics'
import surveys from './surveys'
import opinions from './opinions'
import features from './features'
import matrices from './matrices'
import categories from './categories'
import tools from './tool'
import otherTools from './other_tools'
import resources from './resources'
import query from './query'

export default {
    ...surveys,
    ...demographics,
    ...categories,
    ...opinions,
    ...features,
    ...matrices,
    ...tools,
    ...otherTools,
    ...resources,
    ...query
}
