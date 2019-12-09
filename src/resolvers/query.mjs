import { getEntity } from '../helpers.mjs'

export default {
  tool: async (parent, args, context, info) => {
      const { id } = args
      return {
          id,
          entity: getEntity({ id })
      }
  },
  demographics: (parent, args, context, info) => {
      return {}
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
  // opinions: async (parent, args, context, info) => {
  //     return args.ids.map(id => ({
  //         id
  //     }))
  // },
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