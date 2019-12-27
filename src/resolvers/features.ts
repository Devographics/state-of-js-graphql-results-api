// import { computeFeatureUsageByYear } from '../analysis'
// import { useCache } from '../caching'
import { fetchMdnResource } from '../external_apis'
import features from '../data/features.yml'

export default {
    /*
    FeatureExperience: {
        allYears: async (feature, args, context, info) => {
            return getCachedResult(computeFeatureUsageByYear, context.db, [
                feature.id,
                feature.survey
            ])
        },
        year: async (feature, { year }, context, info) => {
            const allYears = await getCachedResult(computeFeatureUsageByYear, context.db, [
                feature.id,
                feature.survey
            ])
            return allYears.find(y => y.year === year)
        }
    },
    */
    Feature: {
        name: ({ id }: { id: string }) => {
            const feature = features.find(f => f.id === id)

            return feature && feature.name
        },
        mdn: async ({ id }: { id: string }) => {
            const feature = features.find(f => f.id === id)
            if (!feature || !feature.mdn) {
                return
            }

            const mdn = await fetchMdnResource(feature.mdn)

            return mdn.find(t => t.locale === 'en-US')
        }
    }
}
