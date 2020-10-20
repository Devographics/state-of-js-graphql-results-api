import { Db } from 'mongodb'
import { useCache } from '../caching'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { computeTermAggregationByYear } from '../compute'
import { Filters } from '../filters'

interface EnvironmentConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

const computeEnvironment = async (db: Db, survey: SurveyConfig, id: string, filters?: Filters) =>
    useCache(computeTermAggregationByYear, db, [
        survey,
        `environments.${getOtherKey(id)}`,
        // minimal cutoff because we don't have many
        // freeform extra choices for now (others).
        // it's used more to check the volume of data
        // rather than actually using it.
        { filters, cutoff: 0 }
    ])

const computeEnvironmentRating = async (
    db: Db,
    survey: SurveyConfig,
    id: string,
    filters?: Filters
) => useCache(computeTermAggregationByYear, db, [survey, `environments.${id}`, { filters }])

export default {
    Environments: {
        all_years: async (
            { survey, id, filters }: EnvironmentConfig,
            args: any,
            { db }: RequestContext
        ) => computeEnvironment(db, survey, id, filters),
        year: async (
            { survey, id, filters }: EnvironmentConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeEnvironment(db, survey, id, filters)

            return allYears.find(y => y.year === year)
        }
    },
    EnvironmentsRatings: {
        all_years: async (
            { survey, id, filters }: EnvironmentConfig,
            args: any,
            { db }: RequestContext
        ) => computeEnvironmentRating(db, survey, id, filters),
        year: async (
            { survey, id, filters }: EnvironmentConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeEnvironmentRating(db, survey, id, filters)

            return allYears.find(y => y.year === year)
        }
    }
}
