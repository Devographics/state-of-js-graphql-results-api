import { Db } from 'mongodb'
import { SurveyConfig } from '../types'
import { Filters } from '../filters'
import { computeChoicesOverYearsGraph } from './choices_over_years_graph'
import config from '../config'

export const allToolExperienceIds = [
    'would_use',
    'would_not_use',
    'interested',
    'not_interested',
    'never_heard'
] as const
export type ToolExperienceId = typeof allToolExperienceIds[number]

export const allToolCompoundExperienceIds = [
    // `would_use` + `would_not_use` VS total
    'usage',
    // `would_use` + `interested` VS `would_use` + `would_not_use` + `interested` + `not_interested`
    'positive_sentiment',
    // `would_not_use` + `not_interested` VS `would_use` + `would_not_use` + `interested` + `not_interested`
    'negative_sentiment',
    // `would_use` VS `would_not_use`
    'satisfaction',
    // `interested` VS `not_interested`
    'interest',
    // `never_heard` VS total (inverted)
    'awareness'
] as const
export type ToolCompoundExperienceId = typeof allToolCompoundExperienceIds[number]

export type ToolExperienceFilterId = ToolExperienceId | ToolCompoundExperienceId

export const toolExperienceConfigById: Record<
    ToolExperienceFilterId,
    Readonly<{
        predicate: ToolExperienceId | { $in: Readonly<ToolExperienceId[]> }
        comparisonPredicate: ToolExperienceId | { $in: Readonly<ToolExperienceId[]> }
    }>
> = {
    would_use: {
        predicate: 'would_use',
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    would_not_use: {
        predicate: 'would_not_use',
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    interested: {
        predicate: 'interested',
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    not_interested: {
        predicate: 'not_interested',
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    never_heard: {
        predicate: 'never_heard',
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    usage: {
        predicate: { $in: ['would_use', 'would_not_use'] },
        comparisonPredicate: { $in: allToolExperienceIds }
    },
    positive_sentiment: {
        predicate: { $in: ['would_use', 'interested'] },
        comparisonPredicate: {
            $in: ['would_use', 'would_not_use', 'interested', 'not_interested']
        }
    },
    negative_sentiment: {
        predicate: { $in: ['would_not_use', 'not_interested'] },
        comparisonPredicate: {
            $in: ['would_use', 'would_not_use', 'interested', 'not_interested']
        }
    },
    satisfaction: {
        predicate: 'would_use',
        comparisonPredicate: {
            $in: ['would_use', 'would_not_use']
        }
    },
    interest: {
        predicate: 'interested',
        comparisonPredicate: {
            $in: ['interested', 'not_interested']
        }
    },
    awareness: {
        predicate: {
            $in: ['would_use', 'would_not_use', 'interested', 'not_interested']
        },
        comparisonPredicate: { $in: allToolExperienceIds }
    }
} as const

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
