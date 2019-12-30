import { Db } from 'mongodb'
import { useCache } from '../caching'
import { fetchMdnResource } from '../external_apis'
import features from '../data/features.yml'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'
import { Filters } from '../filters'

const computeFeatureExperience = async (
    db: Db,
    survey: SurveyConfig,
    id: string,
    filters?: Filters
) => useCache(computeTermAggregationByYear, db, [survey, `features.${id}`, { filters }])

export default {
    FeatureExperience: {
        allYears: async (
            { survey, id, filters }: { survey: SurveyConfig; id: string; filters?: Filters },
            args: any,
            { db }: RequestContext
        ) => computeFeatureExperience(db, survey, id, filters),
        year: async (
            { survey, id, filters }: { survey: SurveyConfig; id: string; filters?: Filters },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeFeatureExperience(db, survey, id, filters)

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
