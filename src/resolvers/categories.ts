import { Db } from 'mongodb'
import { computeHappinessByYear, computeTermAggregationByYear } from '../compute'
import { useCache } from '../caching'
import { RequestContext, SurveyConfig } from '../types'

interface CategoryConfig {
    survey: SurveyConfig
    id: string
}

const computeOtherTools = async (db: Db, survey: SurveyConfig, categoryId: string) => {
    return useCache(computeTermAggregationByYear, db, [
        survey,
        `sections_other_tools.${categoryId}_normalized`
    ])
}

export default {
    CategoryOtherTools: {
        allYears: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            args: any,
            { db }: RequestContext
        ) => {
            return computeOtherTools(db, survey, id)
        },
        year: async (
            { survey, id }: { survey: SurveyConfig; id: string },
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeOtherTools(db, survey, id)

            return allYears.find(y => y.year === year)
        }
    },
    CategoryHappiness: {
        allYears: async (category: CategoryConfig, args: any, { db }: RequestContext) => {
            return useCache(computeHappinessByYear, db, [category.survey, category.id])
        },
        year: async (
            category: CategoryConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await useCache(computeHappinessByYear, db, [
                category.survey,
                category.id
            ])

            return allYears.find(yearItem => yearItem.year === year)
        }
    }
}
