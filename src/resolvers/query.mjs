import { getEntity } from '../helpers.mjs'

export default {
    demographics: () => ({
        participation: {},
        country: {},
        source: {},
        gender: {},
        salary: {},
        companySize: {},
        experience: {},
        jobTitle: {},
        cssProficiency: {},
        backendProficiency: {},
    }),
    tool: async (parent, args, context, info) => {
        const { id } = args
        return {
            id,
            entity: getEntity({ id })
        }
    },
    feature: async (parent, args, context, info) => {
        return {
            id: args.id,
            section: args.section
        }
    },
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
