import { Db } from 'mongodb'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'
import { computeChoicesOverYearsGraph } from './choices_over_years_graph'

export const allToolExperienceFilterIds = [
    'would_use',
    'would_not_use',
    'interested',
    'not_interested',
    'never_heard',
    // `would_use` + `would_not_use`
    'usage',
    // `would_use` + `interested`
    'positive_sentiment',
    // `would_not_use` + `not_interested`
    'negative_sentiment',
] as const

export type ToolExperienceFilterId = typeof allToolExperienceFilterIds[number]

export const toolExperienceFilterById: Record<
    ToolExperienceFilterId,
    string | { $in: string[] }
> = {
    would_use: 'would_use',
    would_not_use: 'would_not_use',
    interested: 'interested',
    not_interested: 'not_interested',
    never_heard: 'never_heard',
    usage: { $in: ['would_use', 'would_not_use'] },
    positive_sentiment: { $in: ['would_use', 'interested'] },
    negative_sentiment: { $in: ['would_not_use', 'not_interested'] },
}

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
