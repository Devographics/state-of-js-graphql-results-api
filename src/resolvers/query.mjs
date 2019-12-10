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
        backendProficiency: {}
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
    opinion: async (parent, { id }, context, info) => {
        return {
            id
        }
    },
    otherTools: async (parent, { id }, context, info) => {
        return {
            id
        }
    },
    entity: async (parent, { id }, context, info) => {
        return getEntity({ id })
    },
    resources: async (parent, { id }, context, info) => {
        return {
            id
        }
    },
    category: async (parent, { id }, context, info) => ({
        id,
        happiness: {
            id
        },
        workExperience: {
            id
        },
        companySize: {
            id
        },
        salary: {
            id
        }
    })
}
