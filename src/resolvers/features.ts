import { Db } from 'mongodb'
import { useCache } from '../caching'
import { fetchMdnResource } from '../external_apis'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'
import { Filters } from '../filters'
import { Entity } from '../types'
import { getEntities } from '../entities'
import { YearAggregations } from '../compute/generic'

const computeFeatureExperience = async (
    db: Db,
    survey: SurveyConfig,
    id: string,
    filters?: Filters
) => useCache(computeTermAggregationByYear, db, [survey, `features.${id}.experience`, { filters }])

export default {
    FeatureExperience: {
        all_years: async (
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
            return allYears.find((yearItem: YearAggregations) => yearItem.year === year)
        }
    },
    Feature: {
        name: async ({ id }: { id: string }) => {
            const features = await getEntities({ tag: 'feature' })
            const feature = features.find((f: Entity) => f.id === id)

            return feature && feature.name
        },
        mdn: async ({ id }: { id: string }) => {
            const features = await getEntities({ tag: 'feature' })
            const feature = features.find((f: Entity) => f.id === id)
            if (!feature || !feature.mdn) {
                return
            }

            const mdn = await fetchMdnResource(feature.mdn)

            if (mdn) {
                return mdn.find(t => t.locale === 'en-US')
            } else {
                return
            }
        }
    }
}
