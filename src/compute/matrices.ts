import { inspect } from 'util'
import _ from 'lodash'
import { Db } from 'mongodb'
import config from '../config'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { computeTermAggregationByYear } from './generic'

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
        type: string
        year: number
        filters?: Filters
    }
) => {
    const collection = db.collection(config.mongo.normalized_collection)

    const toolExperiencePath = `tools.${tool}.experience`
    let experiencePredicate: any = experience
    // `usage` is not a direct experience ID, it means
    // either `would_use` or `would_not_use`
    if (experience === 'usage') {
        experiencePredicate = { $in: ['would_use', 'would_not_use'] }
    }

    let dimensionPath = `user_info.${type}`
    // `source` is normalized, so we need to access a nested field
    if (type === 'source') {
        dimensionPath = `${dimensionPath}.normalized`
    }

    const match = {
        survey: survey.survey,
        year,
        [toolExperiencePath]: experiencePredicate,
        [dimensionPath]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    const rangeDistributionByYear = await computeTermAggregationByYear(db, survey, dimensionPath, {
        filters,
        cutoff: 0,
        limit: 100
    })
    const rangeDistribution = rangeDistributionByYear.find(yearResults => yearResults.year === year)
    const rangeDistributionByRangeId = _.keyBy(rangeDistribution!.buckets, 'id')

    const results = await collection
        .aggregate([
            {
                $match: match
            },
            {
                $group: {
                    _id: {
                        breakdown: `$${dimensionPath}`
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id.breakdown',
                    count: 1
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])
        .toArray()

    const experienceTotal = await collection.countDocuments({
        survey: survey.survey,
        year,
        [toolExperiencePath]: experiencePredicate
    })

    const total = _.sumBy(results, 'count')
    results.forEach(bucket => {
        bucket.percentage = ratioToPercentage(bucket.count / total)

        const rangeData = rangeDistributionByRangeId[bucket.id]
        if (!rangeData) {
            throw new Error(`unable to get range data for ${type}: ${bucket.id}`)
        }

        bucket.total_in_range = rangeData.count
        bucket.percentage_from_range = ratioToPercentage(bucket.count / bucket.total_in_range)
        // how does the distribution for this specific experience/range compare
        // to the overall distribution for the range?
        bucket.percentage_delta_from_range = _.round(
            bucket.percentage - rangeData.percentage,
            2
        )

        bucket.percentage_from_experience = ratioToPercentage(bucket.count / experienceTotal)
    })

    // console.log(
    //     inspect(
    //         {
    //             id: tool,
    //             match,
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
        filters
    }: {
        survey: SurveyConfig
        tools: string[]
        experience: string
        type: string
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
