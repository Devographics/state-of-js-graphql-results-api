import { Db } from 'mongodb'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'
import { computeChoicesOverYearsGraph } from './choices_over_years_graph'

export async function computeToolExperienceGraph(
    db: Db,
    survey: SurveyConfig,
    tool: string,
    filters?: Filters
) {
    const field = `tools.${tool}.experience`

    const { nodes, links } = await computeChoicesOverYearsGraph(db, survey, field, filters)

    return {
        // remap for experience
        nodes: nodes.map(node => ({
            id: node.id,
            year: node.year,
            experience: node.choice
        })),
        links
    }
}
