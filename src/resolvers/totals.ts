import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'
import { getSurveyTotals } from '../compute/generic'

export default {
    Totals: {
        all_years: async (survey: SurveyConfig, args: any, { db }: RequestContext) =>
            useCache(getSurveyTotals, db, [survey]),
        year: async (survey: SurveyConfig, { year }: { year: number }, { db }: RequestContext) =>
            useCache(getSurveyTotals, db, [survey, year])
    }
}
