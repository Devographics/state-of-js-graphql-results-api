import { Db } from 'mongodb'
import { RequestContext, SurveyConfig, ResolverStaticConfig } from '../types'
import { Filters } from '../filters'
import { useCache } from '../caching'
import { computeParticipationByYear } from '../compute'
import { getStaticResolvers } from '../helpers'
import values from '../data/values.yml'

const computeParticipation = async (
    db: Db,
    survey: SurveyConfig,
    filters?: Filters,
    year?: number
) => useCache(computeParticipationByYear, db, [survey, filters, year])

export default {
    Participation: {
        all_years: async (
            { survey, filters }: ResolverStaticConfig,
            args: any,
            { db }: RequestContext
        ) => computeParticipation(db, survey, filters),
        year: async (
            { survey, filters }: ResolverStaticConfig,
            { year }: { year: number },
            { db }: RequestContext
        ) => {
            const allYears = await computeParticipation(db, survey, filters)
            return allYears.find(y => y.year === year)
        }
    },

    Country: getStaticResolvers('user_info.country_alpha3', {
        limit: 999,
        cutoff: 1
    }),

    LocaleStats: getStaticResolvers('user_info.locale', {
        limit: 100,
        cutoff: 1
    }),

    Source: getStaticResolvers('user_info.source.normalized'),

    Gender: getStaticResolvers('user_info.gender', { cutoff: 1 }),

    RaceEthnicity: getStaticResolvers('user_info.race_ethnicity.choices', { cutoff: 1 }),

    Age: getStaticResolvers('user_info.age', { limit: 100, cutoff: 1, values: values.age }),

    Salary: getStaticResolvers('user_info.yearly_salary', {
        limit: 100,
        cutoff: 1,
        values: values.yearly_salary
    }),

    CompanySize: getStaticResolvers('user_info.company_size', {
        limit: 100,
        cutoff: 1,
        values: values.company_size
    }),

    WorkExperience: getStaticResolvers('user_info.years_of_experience', {
        limit: 100,
        cutoff: 1,
        values: values.years_of_experience
    }),

    JobTitle: getStaticResolvers('user_info.job_title', {
        cutoff: 1
    }),

    IndustrySector: getStaticResolvers('user_info.industry_sector.choices', {
        cutoff: 1
    }),

    KnowledgeScore: getStaticResolvers('user_info.knowledge_score', { limit: 100, cutoff: 1 }),

    HigherEducationDegree: getStaticResolvers('user_info.higher_education_degree', {
        cutoff: 1,
        values: values.higher_education_degree
    }),

    DisabilityStatus: getStaticResolvers('user_info.disability_status.choices', {
        cutoff: 1
    }),

    OtherDisabilityStatus: getStaticResolvers('user_info.disability_status.others.normalized', {
        cutoff: 1
    })
}
