import {
  computeFeatureUsageByYear,
} from '../analysis/index.mjs'

import { getEntity } from '../helpers.mjs'

export default {
  usageByYear: async (feature, args, context, info) => {
      return computeFeatureUsageByYear(context.db, feature.section, feature.id)
  }
}