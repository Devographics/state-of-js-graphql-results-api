import { fetchGithubResource } from '../analysis/index.mjs'
import { loadYaml } from '../helpers.mjs'

const projects = loadYaml('./src/data/projects.yml')

const getSimulatedGithub = id => {
    const projectObject = projects.find(p => p.id === id)
    const { name, description, github, stars, homepage } = projectObject
    return {
        name,
        full_name: projectObject.full_name,
        description,
        url: `https://github.com/${github}`,
        stars,
        homepage
    }
}

export default {
    github: async (entity, args, context, info) => {
        // note: for now just get local data from projects.yml instead of actually querying github
        return getSimulatedGithub(entity.id)
        // const projectObject = projects.find(p => p.id === entity.id)
        // return {
        //     ...projectObject
        // }
        // if (!projectObject || !projectObject.github) {
        //     return
        // }
        // const github = await fetchGithubResource(projectObject.github)
        // return github
    }
}
