import demographics from './demographics'
import surveys from './surveys'
import opinions from './opinions'
import features from './features'
import matrices from './matrices'
import query from './query'

export default {
    ...surveys,
    ...demographics,
    ...opinions,
    ...features,
    ...matrices,
    ...query
}
