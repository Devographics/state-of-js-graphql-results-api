import { getEntity } from '../helpers.mjs'

const mockResourcesBuckets = [
  {
      id: 'SitePoint',
      count: 2942,
      percentage: 26
  },
  {
      id: 'CoDrops',
      count: 3216,
      percentage: 28.42
  },
  {
      id: 'A List Apart',
      count: 3861,
      percentage: 34.12
  },
  {
      id: 'Smashing Magazine',
      count: 6456,
      percentage: 57.05
  },
  {
      id: 'CSS Tricks',
      count: 10085,
      percentage: 89.11
  }
]

export default {
  year: async (opinion, args, context, info) => {
      return {
          year: 2020,
          total: 123,
          completion: { count: 123, percentage: 99 },
          buckets: mockResourcesBuckets.map(resource => ({
              entity: getEntity(resource),
              ...resource
          }))
      }
  }
}