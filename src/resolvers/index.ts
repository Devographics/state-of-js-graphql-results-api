import demographics from './demographics'
import surveys from './surveys'
import query from './query'

export default {
    ...surveys,
    ...demographics,
    ...query
}
