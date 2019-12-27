import demographics from './demographics'
import surveys from './surveys'
import opinions from './opinions'
import query from './query'

export default {
    ...surveys,
    ...demographics,
    ...opinions,
    ...query
}
