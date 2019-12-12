import { fetchGithubResource } from '../analysis/index.mjs'
import { loadYaml } from '../helpers.mjs'

const projects = loadYaml('./src/data/projects.yml')

export default {
    github: async (entity, args, context, info) => {
        const projectObject = projects.find(p => p.id === entity.id)
        if (!projectObject || !projectObject.github) {
            return
        }
        const github = await fetchGithubResource(projectObject.github)
        return github
    }
}
