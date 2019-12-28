import _ from 'lodash'
import { Db } from 'mongodb'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { SurveyConfig } from '../types'

export const computeToolMatrixBreakdown = async (
    db: Db,
    {
        survey,
        tool,
        experience,
        subType,
        year
    }: {
        survey: SurveyConfig
        tool: string
        experience: string
        subType: 'years_of_experience' | 'yearly_salary' | 'company_size'
        year: number
    }
) => {
    const collection = db.collection('normalized_responses')

    const toolPath = `tools.${tool}.experience`
    const breakdownPath = `user_info.${subType}`

    let results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    year,
                    [toolPath]: experience,
                    [breakdownPath]: { $nin: [null, ''] }
                }
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
        subType,
        year
    }: {
        survey: SurveyConfig
        tools: string[]
        experience: string
        subType: 'years_of_experience' | 'yearly_salary' | 'company_size'
        year: number
    }
) {
    const allTools: any[] = []
    for (const tool of tools) {
        allTools.push(
            await computeToolMatrixBreakdown(db, {
                survey,
                tool,
                experience,
                subType,
                year
            })
        )
    }

    return allTools
}
