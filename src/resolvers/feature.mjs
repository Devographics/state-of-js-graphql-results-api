import { computeFeatureUsageByYear } from '../analysis/index.mjs'
import { fetchMdnResource } from '../analysis/index.mjs'
import { loadYaml } from '../helpers.mjs'

const features = loadYaml('./src/data/features.yml')

export default {
    FeatureExperience: {
        allYears: async (feature, args, context, info) => {
            return computeFeatureUsageByYear(context.db, feature.id, feature.survey)
        },
        year: async (feature, { year }, context, info) => {
            const allYears = await computeFeatureUsageByYear(context.db, feature.id, feature.survey)
            return allYears.find(y => y.year === year)
        }
    },
    Feature: {
        mdn: async (feature, args, context, info) => {
            const featureObject = features.find(f => f.id === feature.id)
            if (!featureObject || !featureObject.mdn) {
                return
            }
            const mdn = await fetchMdnResource(featureObject.mdn)
            return mdn.find(t => t.locale === 'en-US')
        }
    }
}
