import {
  computeExperienceOverYears,
  computeParticipationByYear,
  computeGenderBreakdownByYear,
  computeFeatureUsageByYear,
  computeSalaryRangeByYear,
  computeCompanySizeByYear,
  computeYearsOfExperienceByYear,
  computeOpinionByYear,
} from './analysis/index.mjs';
import { getEntity } from './helpers.mjs';

const mockResourcesBuckets = [
  {
    id: 'SitePoint',
    count: 2942,
    percentage: 26,
  },
  {
    id: 'CoDrops',
    count: 3216,
    percentage: 28.42,
  },
  {
    id: 'A List Apart',
    count: 3861,
    percentage: 34.12,
  },
  {
    id: 'Smashing Magazine',
    count: 6456,
    percentage: 57.05,
  },
  {
    id: 'CSS Tricks',
    count: 10085,
    percentage: 89.11,
  },
];

const mockToolsBuckets = [
  {
    id: 'Emacs',
    count: 201,
    percentage: 1.78,
  },
  {
    id: 'Vim',
    count: 1984,
    percentage: 17.53,
  },
  {
    id: 'Webstorm',
    count: 2096,
    percentage: 18.52,
  },
  {
    id: 'Atom',
    count: 2487,
    percentage: 21.98,
  },
  {
    id: 'Sublime Text',
    count: 3855,
    percentage: 34.06,
  },
  {
    id: 'VS Code',
    count: 7994,
    percentage: 70.64,
  },
];

export default {
  Query: {
    tool: async (parent, args, context, info) => {
      return {
        id: args.id,
      };
    },
    demographics: (parent, args, context, info) => {
      return {};
    },
    feature: async (parent, args, context, info) => {
      return {
        id: args.id,
        section: args.section,
      };
    },
    opinion: async (parent, args, context, info) => {
      return {
        id: args.id,
      };
    },
    // opinions: async (parent, args, context, info) => {
    //     return args.ids.map(id => ({
    //         id
    //     }))
    // },
    otherTools: async (parent, args, context, info) => {
      return {
        id: args.id,
      };
    },
    entity: async (parent, args, context, info) => {
      return getEntity({ id: args.id });
    },
    resources: async (parent, args, context, info) => {
      return {
        id: args.id,
      };
    },
  },
  Tool: {
    experience: async (tool, args, context, info) => {
      return computeExperienceOverYears(context.db, tool.id);
    },
  },
  Feature: {
    usageByYear: async (feature, args, context, info) => {
      return computeFeatureUsageByYear(context.db, feature.section, feature.id);
    },
  },
  Demographics: {
    participation: async (parent, args, context, info) => {
      return computeParticipationByYear(context.db);
    },
    gender: async (parent, args, context, info) => {
      return computeGenderBreakdownByYear(context.db);
    },
    salary: async (parent, args, context, info) => {
      return computeSalaryRangeByYear(context.db);
    },
    companySize: async (parent, args, context, info) => {
      return computeCompanySizeByYear(context.db);
    },
    yearsOfExperience: async (parent, args, context, info) => {
      return computeYearsOfExperienceByYear(context.db);
    },
  },
  Opinion: {
    byYear: async (opinion, args, context, info) => {
      return computeOpinionByYear(context.db, opinion.id);
    },
    year: async (opinion, args, context, info) => {
      const allYears = await computeOpinionByYear(context.db, opinion.id);

      return allYears.find(y => y.year === args.year);
    },
  },
  OtherTools: {
    year: async (opinion, args, context, info) => {
      return {
        year: 2020,
        total: 123,
        completion: 99,
        buckets: mockToolsBuckets.map(tool => ({
          ...getEntity(tool),
          ...tool,
        })),
      };
    },
  },
  Resources: {
    year: async (opinion, args, context, info) => {
      return {
        year: 2020,
        total: 123,
        completion: 99,
        buckets: mockResourcesBuckets.map(resource => ({
          ...getEntity(resource),
          ...resource,
        })),
      };
    },
  },
};
