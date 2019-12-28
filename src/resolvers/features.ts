import { useCache } from '../caching'
import { fetchMdnResource } from '../external_apis'
import features from '../data/features.yml'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'

export default {
    FeatureExperience: {
        allYears: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            args: any,
            { db }: RequestContext
        ) => {
            return useCache(computeTermAggregationByYear, db, [survey, `features.${id}`])
        },
        year: async (
            { id, survey }: { id: string; survey: SurveyConfig },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeTermAggregationByYear, db, [
                survey,
                `features.${id}`
            ])

            return allYears.find(y => y.year === year)
        }
    },
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
