import {
  computeParticipationByYear,
  computeGenderBreakdownByYear,
  computeSalaryRangeByYear,
  computeCompanySizeByYear,
  computeYearsOfExperienceByYear,
} from '../analysis/index.mjs'


const mockProficiencyBuckets = [
  {
      id: 0,
      count: 234,
      percentage: 12
  },
  {
      id: 1,
      count: 345,
      percentage: 89
  },
  {
      id: 2,
      count: 234,
      percentage: 34
  },
  {
      id: 3,
      count: 123,
      percentage: 45
  },
  {
      id: 4,
      count: 567,
      percentage: 56
  }
]

const mockJobTitleBuckets = [
  {
      id: 'front_end_developer_engineer',
      count: 213,
      percentage: 23
  },
  {
      id: 'full_stack_developer_engineer',
      count: 567,
      percentage: 14
  },
  {
      id: 'back_end_developer_engineer',
      count: 456,
      percentage: 45
  },
  {
      id: 'web_developer',
      count: 234,
      percentage: 34
  },
]

export default {
  participation: async (parent, args, context, info) => {
      return computeParticipationByYear(context.db)
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
      return [
          {
              year: 2019,
              total: 123,
              completion: { count: 123, percentage: 99 },
              buckets: mockJobTitleBuckets
          }
      ]
  },
  cssProficiency: async (parent, args, context, info) => {
      return [
          {
              year: 2019,
              total: 123,
              completion: { count: 123, percentage: 99 },
              buckets: mockProficiencyBuckets
          }
      ]
  },
  backendProficiency: async (parent, args, context, info) => {
      return [
          {
              year: 2019,
              total: 123,
              completion: { count: 123, percentage: 99 },
              buckets: mockProficiencyBuckets
          }
      ]
  }
}