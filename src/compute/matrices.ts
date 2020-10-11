import _ from 'lodash'
import { Db } from 'mongodb'
import config from '../config'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'

export const computeToolMatrixBreakdown = async (
    db: Db,
    {
        survey,
        tool,
        experience,
        type,
        year,
        filters
    }: {
        survey: SurveyConfig
        tool: string
        experience: string
        type: 'years_of_experience' | 'yearly_salary' | 'company_size'
        year: number
        filters?: Filters
    }
) => {
    const collection = db.collection(config.mongo.normalized_collection)

    const toolPath = `tools.${tool}.experience`
    const breakdownPath = `user_info.${type}`

    const match = {
        survey: survey.survey,
        year,
        [toolPath]: experience,
        [breakdownPath]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    let results = await collection
        .aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: {
                        breakdown: `$${breakdownPath}`
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    range: '$_id.breakdown',
                    count: 1
                }
            }
        ])
        .toArray()

    // compute percentages
    const total = _.sumBy(results, 'count')
    results.forEach(bucket => {
        bucket.percentage = ratioToPercentage(bucket.count / total)
    })

    return {
        id: tool,
        entity: getEntity({ id: tool }),
        total,
        ranges: results
    }
}

export async function computeToolsMatrix(
    db: Db,
    {
        survey,
        tools,
        experience,
        type,
        year,
        filters
    }: {
        survey: SurveyConfig
        tools: string[]
        experience: string
        type: 'years_of_experience' | 'yearly_salary' | 'company_size'
        year: number
        filters?: Filters
    }
) {
    const allTools: any[] = []
    for (const tool of tools) {
        allTools.push(
            await computeToolMatrixBreakdown(db, {
                survey,
                tool,
                experience,
                type,
                year,
                filters
            })
        )
    }

    return allTools
}
