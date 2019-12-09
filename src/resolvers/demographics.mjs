import {
    computeParticipationByYear,
    computeGenderBreakdownByYear,
    computeSalaryRangeByYear,
    computeCompanySizeByYear,
    computeYearsOfExperienceByYear
} from '../analysis/index.mjs'

import { loadYaml } from '../helpers.mjs'

export default {
    Participation: {
        allYears: async (parent, args, context, info) => {
            return computeParticipationByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            return [computeParticipationByYear(context.db)].find(y => y.year === args.year)
        }
    },
    Country: {
        allYears: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/country.yml')
        },
        year: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/country.yml').find(y => y.year === args.year)
        }
    },
    Source: {
        allYears: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/source.yml')
        },
        year: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/source.yml').find(y => y.year === args.year)
        }
    },
    Gender: {
        allYears: async (parent, args, context, info) => {
            return computeGenderBreakdownByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            return [computeGenderBreakdownByYear(context.db)].find(y => y.year === args.year)
        }
    },
    Salary: {
        allYears: async (parent, args, context, info) => {
            return computeSalaryRangeByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            return computeSalaryRangeByYear(context.db).find(y => y.year === args.year)
        }
    },
    CompanySize: {
        allYears: async (parent, args, context, info) => {
            return computeCompanySizeByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            return computeCompanySizeByYear(context.db).find(y => y.year === args.year)
        }
    },
    Experience: {
        allYears: async (parent, args, context, info) => {
            return computeYearsOfExperienceByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            return computeYearsOfExperienceByYear(context.db).find(y => y.year === args.year)
        }
    },
    JobTitle: {
        allYears: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/jobTitle.yml')
        },
        year: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/jobTitle.yml').find(y => y.year === args.year)
        }
    },
    CSSProficiency: {
        allYears: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/cssProficiency.yml')
        },
        year: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/cssProficiency.yml').find(y => y.year === args.year)
        }
    },
    BackendProficiency: {
        allYears: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/backendProficiency.yml')
        },
        year: async (parent, args, context, info) => {
            return loadYaml('./src/mocks/backendProficiency.yml').find(y => y.year === args.year)
        }
    },
}
