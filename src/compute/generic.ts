import { Db } from 'mongodb'
import { inspect } from 'util'
import keyBy from 'lodash/keyBy'
import orderBy from 'lodash/orderBy'
import config from '../config'
import { Completion, SurveyConfig, YearParticipation } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { Facet } from '../facets'
import { ratioToPercentage } from './common'
import { getEntity } from '../entities'
import { getParticipationByYearMap } from './demographics'
import { useCache } from '../caching'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import { WinsYearAggregations } from './brackets'
import { getGenericPipeline } from './generic_pipeline'

export interface TermAggregationOptions {
    // filter aggregations
    filters?: Filters
    sort?: string
    order?: -1 | 1
    cutoff?: number
    limit?: number
    year?: number
    values?: string[]
    facet?: Facet
}

export interface RawResult {
    id: number | string
    entity?: any
    year: number
    count: number
}

export interface CompletionResult {
    year: number
    total: number
}

export interface TermBucket {
    id: number | string
    entity?: any
    count: number
    countDelta?: number
    percentage: number
    percentageOfTotal?: number
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

    // use last segment of field as id
    const fieldId = key.split('.').reverse()[0]

    const {
        filters,
        sort = 'count',
        order = -1,
        cutoff = 10,
        limit = 25,
        year,
        facet = 'default',
        values
    }: TermAggregationOptions = options

    console.log('// options')
    console.log(options)

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, '', []] },
        ...generateFiltersQuery(filters)
    }
    // if year is passed, restrict aggregation to specific year
    if (year) {
        match.year = year
    }

    const totalRespondentsByYear = await getParticipationByYearMap(db, survey)
    const completionByYear = await computeCompletionByYear(db, match)

    // console.log(match)

    const pipelineProps = {
        match,
        facet,
        fieldId,
        key,
        year,
        limit,
        filters,
        survey: survey.survey
    }

    const rawResults = (await collection
        .aggregate(getGenericPipeline(pipelineProps))
        .toArray()) as RawResult[]

    console.log(
        inspect(
            {
                match,
                sampleAggregationPipeline: getGenericPipeline(pipelineProps),
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

    // group by years and add counts, and also sort buckets
    const resultsByYear = <YearAggregations[]>(
        (<unknown>(
            await groupByYears(
                resultsWithEntity,
                db,
                survey,
                match,
                totalRespondentsByYear,
                completionByYear,
                values
            )
        ))
    )

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

    return resultsWithPercentages
}

interface GroupByYearResult {
    id: string | number
    year: number
}

export async function groupByYears(
    results: GroupByYearResult[],
    db: Db,
    survey: SurveyConfig,
    match: any,
    totalRespondentsByYear: {
        [key: number]: number
    },
    completionByYear: Record<number, CompletionResult>,
    values?: string[] | number[]
) {
    const years = uniq(results.map(r => r.year))

    const resultsWithYears = years.map((year: number) => {
        const totalRespondents = totalRespondentsByYear[year] ?? 0
        const completionCount = completionByYear[year]?.total ?? 0

        let yearBuckets = results.filter(r => r.year === year)

        // 1. Sort values
        // if a list of valid values is provided, make sure the bucket uses the same ordering
        if (values) {
            yearBuckets = [...yearBuckets].sort((a, b) => {
                // make sure everything is a string to avoid type mismatches
                const stringValues = values.map(v => v.toString())
                return stringValues.indexOf(a.id.toString()) - stringValues.indexOf(b.id.toString())
            })
        }

        // 2. Add completion counts
        const yearObject = {
            year,
            total: totalRespondents,
            completion: {
                total: totalRespondents,
                count: completionCount,
                percentage: ratioToPercentage(completionCount / totalRespondents)
            },
            buckets: yearBuckets
        }
        return yearObject
    })

    return orderBy(resultsWithYears, 'year')
}

export function sortbyValues(resultsByYear: YearAggregations[], values: string[]) {
    const sortedResults = resultsByYear
    return sortedResults
}

export function computePercentages(resultsByYear: YearAggregations[]) {
    resultsByYear.forEach(yearResult => {
        yearResult.buckets.forEach(bucket => {
            bucket.percentage = ratioToPercentage(bucket.count / yearResult.completion.count)
            bucket.percentageOfTotal = ratioToPercentage(bucket.count / yearResult.total)
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
