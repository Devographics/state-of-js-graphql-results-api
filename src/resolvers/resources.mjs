import { loadYaml, getEntity } from '../helpers.mjs'

export default {
  year: async (opinion, args, context, info) => {
    const mockData = loadYaml('./src/mocks/resources.yml');
    mockData.forEach(year => {
        year.buckets = year.buckets.map(tool => ({
          entity: getEntity(tool),
          ...tool
      }))
    })
    return mockData
  }
}