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
            return await computeGenderBreakdownByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            const allYears = await computeGenderBreakdownByYear(context.db)
            return allYears.find(y => y.year === args.year)
        }
    },
    Salary: {
        allYears: async (parent, args, context, info) => {
            return await computeSalaryRangeByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            const allYears = await computeSalaryRangeByYear(context.db)
            return allYears.find(y => y.year === args.year)
        }
    },
    CompanySize: {
        allYears: async (parent, args, context, info) => {
            return await computeCompanySizeByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            const allYears = await computeCompanySizeByYear(context.db)
            return allYears.find(y => y.year === args.year)
        }
    },
    WorkExperience: {
        allYears: async (parent, args, context, info) => {
            return await computeYearsOfExperienceByYear(context.db)
        },
        year: async (parent, args, context, info) => {
            const allYears = await computeYearsOfExperienceByYear(context.db)
            return allYears.find(y => y.year === args.year)
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
