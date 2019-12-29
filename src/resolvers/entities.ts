import { GitHub, SurveyConfig } from '../types'
import projects from '../data/projects.yml'

const getSimulatedGithub = (id: string): GitHub | null => {
    const project = projects.find(p => p.id === id)

    if (project !== undefined) {
        const { name, description, github, stars, homepage } = project

        return {
            id,
            name,
            description,
            url: `https://github.com/${github}`,
            stars,
            homepage
        }
    } else {
        return null
    }
}

export default {
    Entity: {
        github: async ({ id }: { survey: SurveyConfig; id: string }) => {
            // note: for now just get local data from projects.yml
            // instead of actually querying github
            return getSimulatedGithub(id)
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
}
