import {
  computeParticipationByYear,
  computeGenderBreakdownByYear,
  computeSalaryRangeByYear,
  computeCompanySizeByYear,
  computeYearsOfExperienceByYear,
} from '../analysis/index.mjs'

import { loadYaml } from '../helpers.mjs'

export default {
  participation: async (parent, args, context, info) => {
      return computeParticipationByYear(context.db)
  },
  country: async (parent, args, context, info) => {
    return loadYaml('./src/mocks/country.yml')
  },
  source: async (parent, args, context, info) => {
    return loadYaml('./src/mocks/source.yml')
  },
  gender: async (parent, args, context, info) => {
      return computeGenderBreakdownByYear(context.db)
  },
  salary: async (parent, args, context, info) => {
      return computeSalaryRangeByYear(context.db)
  },
  companySize: async (parent, args, context, info) => {
      return computeCompanySizeByYear(context.db)
  },
  yearsOfExperience: async (parent, args, context, info) => {
      return computeYearsOfExperienceByYear(context.db)
  },
  jobTitle:  async (parent, args, context, info) => {
      return loadYaml('./src/mocks/jobTitle.yml')
  },
  cssProficiency: async (parent, args, context, info) => {
      return loadYaml('./src/mocks/cssProficiency.yml')
  },
  backendProficiency: async (parent, args, context, info) => {
      return loadYaml('./src/mocks/backendProficiency.yml')
  }
}