import { inspect } from 'util'
import _ from 'lodash'
import { Db } from 'mongodb'
import config from '../config'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { SurveyConfig } from '../types'
import { ToolExperienceFilterId, toolExperienceFilterById } from './tools'

export const computeToolMatrixBreakdown = async (
    db: Db,
    {
        survey,
        tool,
        experience,
        type,
        year,
    }: {
        survey: SurveyConfig
        tool: string
        experience: ToolExperienceFilterId
        type: string
        year: number
    }
) => {
    const collection = db.collection(config.mongo.normalized_collection)

    // define the key to use to filter tool experience
    // and the filter to apply, which might be a compound filter.
    const experienceKey = `tools.${tool}.experience`
    const experiencePredicate = toolExperienceFilterById[experience]

    let dimensionPath = `user_info.${type}`
    // `source` is normalized, so we need to access a nested field
    if (type === 'source') {
        dimensionPath = `${dimensionPath}.normalized`
    }

    // ensure we compare dimensions to answers having both
    // the dimension and the experience defined.
    const dimensionDistributionPipeline = [
        {
            $match: {
                survey: survey.survey,
                year,
                [experienceKey]: {
                    $exists: true,
                    $nin: [null, ''],
                },
                [dimensionPath]: {
                    $exists: true,
                    $nin: [null, ''],
                },
            },
        },
        {
            // group by dimension choice
            $group: {
                _id: {
                    group_by: `$${dimensionPath}`
                },
                count: { $sum: 1 },
            }
        },
        {
            $project: {
                _id: 0,
                id: '$_id.group_by',
                count: 1,
            },
        },
    ]
    let dimensionDistributionResults = await collection
        .aggregate(dimensionDistributionPipeline)
        .toArray()
    const dimensionDistributionTotal = _.sumBy(dimensionDistributionResults, 'count')
    dimensionDistributionResults = dimensionDistributionResults.map(datum => {
        return {
            ...datum,
            percentage: datum.count / dimensionDistributionTotal * 100,
        }
    })
    const dimensionDistributionById = _.keyBy(dimensionDistributionResults, 'id')

    const mainAggregationPipeline = [
        {
            $match: {
                survey: survey.survey,
                year,
                [experienceKey]: experiencePredicate,
                [dimensionPath]: {
                    $exists: true,
                    $nin: [null, ''],
                },
            },
        },
        {
            $group: {
                _id: {
                    group_by: `$${dimensionPath}`
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                id: '$_id.group_by',
                count: 1
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]
    const results = await collection
        .aggregate(mainAggregationPipeline)
        .toArray()

    const experienceTotalQuery = {
        survey: survey.survey,
        year,
        [experienceKey]: experiencePredicate,
        [dimensionPath]: {
            $exists: true,
            $nin: [null, ''],
        },
    }
    const experienceTotal = await collection.countDocuments(experienceTotalQuery)

    const total = _.sumBy(results, 'count')
    results.forEach(bucket => {
        bucket.percentage = ratioToPercentage(bucket.count / total)

        // As we're using an intersection, it's safe to assume that
        // the dimension item is always available.
        const dimensionBucket = dimensionDistributionById[bucket.id]

        bucket.total_in_range = dimensionBucket.count
        bucket.percentage_from_range = ratioToPercentage(bucket.count / bucket.total_in_range)
        // how does the distribution for this specific experience/range compare
        // to the overall distribution for the range?
        bucket.percentage_delta_from_range = _.round(
            bucket.percentage - dimensionBucket.percentage,
            2
        )

        bucket.percentage_from_experience = ratioToPercentage(bucket.count / experienceTotal)
    })

    // console.log(
    //     inspect(
    //         {
    //             mainAggregationPipeline,
    //             experienceTotalQuery,
    //             dimensionDistributionPipeline,
    //             dimensionDistributionById,
    //             id: tool,
    //             total,
    //             total_in_experience: experienceTotal,
    //             ranges: results
    //         },
    //         { colors: true, depth: null }
    //     )
    // )

    return {
        id: tool,
        entity: getEntity({ id: tool }),
        total,
        total_in_experience: experienceTotal,
        buckets: results
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
    }: {
        survey: SurveyConfig
        tools: string[]
        experience: ToolExperienceFilterId
        type: string
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
                type,
                year,
            })
        )
    }

    return allTools
}
