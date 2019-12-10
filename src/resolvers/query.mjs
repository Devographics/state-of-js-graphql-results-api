import { getEntity } from '../helpers.mjs'

export default {
    demographics: () => ({
        participation: {},
        country: {},
        source: {},
        gender: {},
        salary: {},
        companySize: {},
        workExperience: {},
        jobTitle: {},
        cssProficiency: {},
        backendProficiency: {},
    }),
    tool: async (parent, { id }, context, info) => ({
        id,
        entity: getEntity({ id }),
        experience: {
            id
        }
    }),
    feature: async (parent, { id }, context, info) => ({
        id,
        experience: {
            id
        }
    }),
    opinion: async (parent, args, context, info) => {
        return {
            id: args.id
        }
    },
    otherTools: async (parent, args, context, info) => {
        return {
            id: args.id
        }
    },
    entity: async (parent, args, context, info) => {
        return getEntity({ id: args.id })
    },
    resources: async (parent, args, context, info) => {
        return {
            id: args.id
        }
    },
    happiness: async (parent, args, context, info) => {
        return {
            id: args.id
        }
    }
}
