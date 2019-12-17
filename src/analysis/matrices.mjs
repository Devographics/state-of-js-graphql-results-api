import { ratioToPercentage } from './common.mjs'
import _ from 'lodash'
import util from 'util'

export const computeToolMatrixBreakdown = async (
    db,
    tool,
    experienceFilter,
    subType,
    year,
    survey
) => {
    const collection = db.collection('normalized_responses')

    const toolPath = `tools.${tool}.experience`
    const breakdownPath = `user_info.${subType}`

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    year,
                    [toolPath]: experienceFilter,
                    // exclude null and empty values
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
            // reshape documents
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
        total,
        ranges: results
    }
}

export const computeToolsMatrix = async (db, { survey, ids: tools, year, experience, subType }) => {
    const allTools = []
    for (const tool of tools) {
        allTools.push(
            await computeToolMatrixBreakdown(db, tool, experience, subType, year, survey)
        )
    }

    // console.log(util.inspect(allTools, { depth: null, colors: true }))

    return allTools
}
