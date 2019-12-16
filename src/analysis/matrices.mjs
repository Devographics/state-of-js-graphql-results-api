import { ratioToPercentage } from './common.mjs'
import _ from 'lodash'

export const computeToolMatrixBreakdown = async (
    db,
    tool,
    experienceFilter,
    matrixType,
    year,
    survey
) => {
    const collection = db.collection('normalized_responses')

    const toolPath = `tools.${tool}.experience`
    const breakdownPath = `user_info.${matrixType}`

    console.log(toolPath, breakdownPath)

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
                    id: '$_id.breakdown',
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

    return results
}

export const computeToolsMatrix = async (db, tools, experienceFilter, matrixType, year, survey) => {
    console.log({
        tools,
        experienceFilter,
        matrixType,
        survey
    })

    const allTools = []
    for (const tool of tools) {
        allTools.push(
            await computeToolMatrixBreakdown(db, tool, experienceFilter, matrixType, year, survey)
        )
    }

    return allTools
}
