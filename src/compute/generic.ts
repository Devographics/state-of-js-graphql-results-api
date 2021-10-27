import { Db } from 'mongodb'
import { inspect } from 'util'
import keyBy from 'lodash/keyBy'
import orderBy from 'lodash/orderBy'
import config from '../config'
import { Completion, SurveyConfig } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { ratioToPercentage } from './common'
import { getEntity } from '../entities'
import { getParticipationByYearMap } from './demographics'
import { useCache } from '../caching'
import uniq from 'lodash/uniq'
import { WinsYearAggregations } from './brackets'

export interface TermAggregationOptions {
    // filter aggregations
    filters?: Filters
    sort?: string
    order?: -1 | 1
    cutoff?: number
    limit?: number
    year?: number
}

export interface RawResult {
    id: number | string
    entity?: any
    year: number
    total: number
}

export interface CompletionResult {
    year: number
    total: number
}

export interface TermBucket {
    id: number | string
    entity?: any
    count: number
    total: number // alias for count
    countDelta?: number
    percentage: number
    percentageDelta?: number
}

export interface YearAggregations {
    year: number
    total: number
    completion: Completion
    buckets: TermBucket[]
}

export type AggregationFunction = (
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions
) => Promise<any>

export async function getSurveyTotals(db: Db, surveyConfig: SurveyConfig, year?: Number) {
    const collection = db.collection(config.mongo.normalized_collection)
    let selector: any = {
        survey: surveyConfig.survey
    }
    if (year) {
        selector = { ...selector, year }
    }
    return collection.countDocuments(selector)
}

export async function computeCompletionByYear(
    db: Db,
    match: any
): Promise<Record<number, CompletionResult>> {
    const collection = db.collection(config.mongo.normalized_collection)

    const aggregationPipeline = [
        {
            $match: match
        },
        {
            $group: {
                _id: { year: '$year' },
                total: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                year: '$_id.year',
                total: 1
            }
        }
    ]

    const completionResults = (await collection
        .aggregate(aggregationPipeline)
        .toArray()) as CompletionResult[]

    // console.log(
    //     inspect(
    //         {
    //             aggregationPipeline,
    //             completionResults,
    //         },
    //         { colors: true, depth: null }
    //     )
    // )

    return keyBy(completionResults, 'year')
}

// no cutoff for now
const addCutoff = false

export async function computeTermAggregationByYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions = {},
    aggregationFunction: AggregationFunction = computeDefaultTermAggregationByYear
) {
    return aggregationFunction(db, survey, key, options)
}

export async function computeDefaultTermAggregationByYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions = {}
) {
    const collection = db.collection(config.mongo.normalized_collection)

    const {
        filters,
        sort = 'total',
        order = -1,
        cutoff = 10,
        limit = 25,
        year
    }: TermAggregationOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, '', []] },
        ...generateFiltersQuery(filters)
    }
    // if year is passed, restrict aggregation to specific year
    if (year) {
        match.year = year
    }

    // console.log(match)

    // generate an aggregation pipeline for all years, or
    // optionally restrict it to a specific year of data
    const getAggregationPipeline = () => {
        const pipeline: any[] = [
            {
                $match: match
            },
            {
                $unwind: {
                    path: `$${key}`
                }
            },
            {
                $group: {
                    _id: {
                        id: `$${key}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id.id',
                    year: '$_id.year',
                    total: 1
                }
            },
            { $sort: { [sort]: order } }
        ]

        if (addCutoff) {
            pipeline.push({ $match: { total: { $gt: cutoff } } })
        }

        // only add limit if year is specified
        if (year) {
            pipeline.push({ $limit: limit })
        }
        return pipeline
    }

    const rawResults = (await collection
        .aggregate(getAggregationPipeline())
        .toArray()) as RawResult[]

    console.log(
        inspect(
            {
                match,
                sampleAggregationPipeline: getAggregationPipeline(),
                rawResults
            },
            { colors: true, depth: null }
        )
    )

    // add entities if applicable
    const resultsWithEntity = []
    for (let result of rawResults) {
        const entity = await getEntity(result as any)
        if (entity) {
            result = { ...result, entity }
        }
        resultsWithEntity.push(result)
    }
            
    // group by years and add counts
    const resultsByYear = <YearAggregations[]><unknown>await groupByYears(resultsWithEntity, db, survey, match)

    // compute percentages
    const resultsWithPercentages = computePercentages(resultsByYear)

    // compute deltas
    resultsWithPercentages.forEach((year, i) => {
        const previousYear = resultsByYear[i - 1]
        if (previousYear) {
            year.buckets.forEach(bucket => {
                const previousYearBucket = previousYear.buckets.find(b => b.id === bucket.id)
                if (previousYearBucket) {
                    bucket.countDelta = bucket.count - previousYearBucket.count
                    bucket.percentageDelta =
                        Math.round(100 * (bucket.percentage - previousYearBucket.percentage)) / 100
                }
            })
        }
    })

    return resultsByYear
}

interface GroupByYearResult {
    id: number | string
    year: number
}

export async function groupByYears(
    results: GroupByYearResult[],
    db: Db,
    survey: SurveyConfig,
    match: any,
) {
    const years = uniq(results.map(r => r.year))

    const totalRespondentsByYear = await getParticipationByYearMap(db, survey)
    const completionByYear = await computeCompletionByYear(db, match)

    const resultsWithYears = years.map((year: number) => {
        const totalRespondents = totalRespondentsByYear[year] ?? 0
        const completionCount = completionByYear[year]?.total ?? 0

        const buckets = results
            .filter(r => r.year === year)

        const yearBucket = {
            year,
            total: totalRespondents,
            completion: {
                total: totalRespondents,
                count: completionCount,
                percentage: ratioToPercentage(completionCount / totalRespondents)
            },
            buckets
        }
        return yearBucket
    })

    return orderBy(resultsWithYears, 'year')
}

export function computePercentages (resultsByYear: YearAggregations[]) {
    
    resultsByYear.forEach(yearResult => {
        yearResult.buckets.forEach(bucket => {
            bucket.count = bucket.total
            bucket.percentage = ratioToPercentage(bucket.count / yearResult.completion.count)
        })
    })
    return resultsByYear
}

export async function computeTermAggregationAllYearsWithCache(
    db: Db,
    survey: SurveyConfig,
    id: string,
    options: TermAggregationOptions = {},
    aggregationFunction?: AggregationFunction
) {
    return useCache(computeTermAggregationByYear, db, [survey, id, options, aggregationFunction])
}

export async function computeTermAggregationSingleYear(
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions,
    aggregationFunction?: AggregationFunction
) {
    const allYears = await computeTermAggregationByYear(
        db,
        survey,
        key,
        options,
        aggregationFunction
    )
    return allYears[0]
}

export async function computeTermAggregationSingleYearWithCache(
    db: Db,
    survey: SurveyConfig,
    id: string,
    options: TermAggregationOptions,
    aggregationFunction?: AggregationFunction
) {
    return useCache(computeTermAggregationSingleYear, db, [
        survey,
        id,
        options,
        aggregationFunction
    ])
}
