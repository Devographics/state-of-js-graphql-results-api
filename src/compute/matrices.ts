import { inspect } from 'util'
import _ from 'lodash'
import { Db } from 'mongodb'
import config from '../config'
import { ratioToPercentage } from './common'
import { getEntity } from '../helpers'
import { SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { computeTermAggregationByYear } from './generic'

interface MatrixBucket {
    // Id of the range, e.g. `range_50_100` for `company_size`.
    id: string
    // Number of responses for a given tool/feature in a specific range.
    // e.g. users who picked `range_50_100` for `company_size`
    // and also picked `would_use` for experience with `tailwind_css`.
    count: number
    // Number of respondents who picked both an answer
    // for the `experience` question about the tool/feature
    // and the range topic (e.g. `company_size`).
    total: number
    // `count` VS `total`
    percentage: number
    // Number of participants who answered
    // the experience question about the tool/feature.
    // e.g. users who picked `would_use` for experience
    // with `tailwind_css`.
    total_in_experience: number
    // Distribution of range in experience,
    // `count` VS `total_in_experience`.
    percentage_from_experience: number
    // Total number of respondents for this specific range,
    // e.g. number of users who selected `range_50_100`
    // for the `company_size` question.
    total_in_range: number
    // Distribution of experience in range,
    // `count` VS `total_in_range`.
    percentage_from_range: number
}

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
        type: 'years_of_experience' | 'yearly_salary' | 'company_size' | 'source'
        year: number
        filters?: Filters
    }
) => {
    const collection = db.collection(config.mongo.normalized_collection)

    const toolPath = `tools.${tool}.experience`
    let breakdownPath = `user_info.${type}`

    // `source` is normalized, so we need to access a nested field
    if (type === 'source') {
        breakdownPath = `${breakdownPath}.normalized`
    }

    const rangeDistributionByYear = await computeTermAggregationByYear(db, survey, breakdownPath, {
        filters,
        cutoff: 0,
        limit: 100
    })
    const rangeDistribution = rangeDistributionByYear.find(yearResults => yearResults.year === year)
    const rangeDistributionByRangeId = _.keyBy(rangeDistribution!.buckets, 'id')

    const match = {
        survey: survey.survey,
        year,
        [toolPath]: experience,
        [breakdownPath]: { $nin: [null, ''] },
        ...generateFiltersQuery(filters)
    }

    const results = await collection
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
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])
        .toArray()

    const experienceTotal = await collection.countDocuments({
        survey: survey.survey,
        year,
        [toolPath]: experience
    })

    const total = _.sumBy(results, 'count')
    results.forEach(bucket => {
        bucket.percentage = ratioToPercentage(bucket.count / total)

        const rangeData = rangeDistributionByRangeId[bucket.range]
        if (!rangeData) {
            throw new Error(`unable to get range data for ${type}: ${bucket.range}`)
        }

        bucket.total_in_range = rangeDistributionByRangeId[bucket.range].count
        bucket.percentage_from_range = ratioToPercentage(bucket.count / bucket.total_in_range)
        // how does the distribution for this specific experience/range compare
        // to the overall distribution for the range?
        bucket.percentage_delta_from_range = _.round(
            bucket.percentage - rangeDistributionByRangeId[bucket.range].percentage,
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
        type: 'years_of_experience' | 'yearly_salary' | 'company_size' | 'source'
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
