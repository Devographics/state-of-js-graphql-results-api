import { loadYaml, getEntity } from '../helpers.mjs'

const getMockData = () => {
    const mockData = loadYaml('./src/mocks/resources.yml')
    mockData.forEach(year => {
        year.buckets = year.buckets.map(tool => ({
            entity: getEntity(tool),
            ...tool
        }))
    })
    return mockData
}

export default {
    allYears: async (opinion, args, context, info) => {
        return getMockData()
    },
    year: async (opinion, args, context, info) => {
        return getMockData().find(yearItem => yearItem.year === args.year)
    }
}
