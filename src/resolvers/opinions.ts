import { getDynamicResolvers } from '../helpers'

export default {
    Opinion: getDynamicResolvers(id => `opinions.${id}`, { sort: 'id', order: 1 }),
    OtherOpinions: getDynamicResolvers(id => `opinions_others.${id}.others.normalized`, {
        sort: 'id',
        order: 1
    })
}
