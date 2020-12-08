import {
    computeTermAggregationAllYearsWithCache,
    computeTermAggregationSingleYearWithCache
} from '../compute'
import { getOtherKey } from '../helpers'
import { RequestContext, SurveyConfig } from '../types'
import { Filters } from '../filters'

interface OtherToolsConfig {
    survey: SurveyConfig
    id: string
    filters?: Filters
}

export default {
    OtherTools: {
        all_years: async (
            { survey, id, filters }: OtherToolsConfig,
            args: any,
            { db }: RequestContext
        ) =>
            computeTermAggregationAllYearsWithCache(db, survey, `tools_others.${getOtherKey(id)}`, {
                filters
            }),
        year: async (
            { survey, id, filters }: OtherToolsConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) =>
            computeTermAggregationSingleYearWithCache(
                db,
                survey,
                `tools_others.${getOtherKey(id)}`,
                { filters, year }
            )
    }
}
