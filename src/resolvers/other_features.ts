import { Db } from 'mongodb'
import features from '../data/entities/features.yml'
import { useCache } from '../caching'
import { computeTermAggregationByYear } from '../compute'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'
import { Entity } from '../types'

interface OtherFeaturesConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeOtherFeatures = async (
    db: Db,
    survey: SurveyConfig,
    id: string,
    filters?: Filters
) => {
    const otherFeaturesByYear = await useCache(computeTermAggregationByYear, db, [
        survey,
        `features_others.${getOtherKey(id)}`,
        { filters }
    ])

    return otherFeaturesByYear.map(yearOtherFeatures => {
        return {
            ...yearOtherFeatures,
            buckets: yearOtherFeatures.buckets.map(bucket => {
                const feature = features.find((f: Entity) => f.id === bucket.id)

                return {
                    ...bucket,
                    name: feature ? feature.name : bucket.id
                }
            })
        }
    })
}

export default {
    OtherFeatures: {
        all_years: async (
            { survey, id, filters }: OtherFeaturesConfig,
            args: any,
            { db }: RequestContext
        ) => computeOtherFeatures(db, survey, id, filters),
        year: async (
            { survey, id, filters }: OtherFeaturesConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherFeatures(db, survey, id, filters)
            return allYears.find(y => y.year === year)
        }
    }
}
