import { Db } from 'mongodb'
import { inspect } from 'util'
import config from '../config'
import { Completion, SurveyConfig, Entity } from '../types'
import { Filters, generateFiltersQuery } from '../filters'
import { Facet } from '../facets'
import { ratioToPercentage } from './common'
import { getEntity } from '../entities'
import { getParticipationByYearMap } from './demographics'
import { useCache } from '../caching'
import sortBy from 'lodash/sortBy'
import { getGenericPipeline } from './generic_pipeline'
import { CompletionResult, computeCompletionByYear } from './completion'

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

export interface ResultsByYear {
    year: number
    facets: FacetItem[]
    completion: Completion
}

export interface FacetItem {
    type: Facet
    id: number | string
    buckets: BucketItem[]
    entity?: Entity
}

export interface BucketItem {
    id: number | string
    count: number
    percentage?: number
    percentageOfTotal?: number
    entity?: Entity
}

export interface RawResult {
    id: number | string
    entity?: Entity
    year: number
    count: number
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
        facet,
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

    // TODO: merge these counts into the main aggregation pipeline if possible
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
        cutoff,
        survey: survey.survey
    }

    let results = (await collection
        .aggregate(getGenericPipeline(pipelineProps))
        .toArray()) as ResultsByYear[]

    console.log(
        inspect(
            {
                match,
                sampleAggregationPipeline: getGenericPipeline(pipelineProps),
                results
            },
            { colors: true, depth: null }
        )
    )

    await addEntities(results)

    await addCompletionCounts(results, totalRespondentsByYear, completionByYear)

    await addPercentages(results)

    // await addDeltas(results)

    await sortResults(results, { sort, order, values })

    console.log(JSON.stringify(results, undefined, 2))

    return results
}

// add entities to facet and bucket items if applicable
export async function addEntities(resultsByYears: ResultsByYear[]) {
    for (let year of resultsByYears) {
        for (let facet of year.facets) {
            const facetEntity = await getEntity(facet)
            if (facetEntity) {
                facet.entity = facetEntity
            }
            for (let bucket of facet.buckets) {
                const bucketEntity = await getEntity(bucket)
                if (bucketEntity) {
                    bucket.entity = bucketEntity
                }
            }
        }
    }
}

// add completion counts for each year
export async function addCompletionCounts(
    resultsByYears: ResultsByYear[],
    totalRespondentsByYear: {
        [key: number]: number
    },
    completionByYear: Record<number, CompletionResult>
) {
    for (let yearObject of resultsByYears) {
        const totalRespondents = totalRespondentsByYear[yearObject.year] ?? 0
        const completionCount = completionByYear[yearObject.year]?.total ?? 0
        yearObject.completion = {
            total: totalRespondents,
            count: completionCount,
            percentage: ratioToPercentage(completionCount / totalRespondents)
        }
    }
}

// add percentages relative to question respondents and survey respondents
export async function addPercentages(resultsByYears: ResultsByYear[]) {
    for (let year of resultsByYears) {
        for (let facet of year.facets) {
            for (let bucket of facet.buckets) {
                bucket.percentage = ratioToPercentage(bucket.count / year.completion.count)
                bucket.percentageOfTotal = ratioToPercentage(bucket.count / year.completion.total)
            }
        }
    }
}

// TODO ? or else remove this
export async function addDeltas(resultsByYears: ResultsByYear[]) {
    // // compute deltas
    // resultsWithPercentages.forEach((year, i) => {
    //     const previousYear = resultsByYear[i - 1]
    //     if (previousYear) {
    //         year.buckets.forEach(bucket => {
    //             const previousYearBucket = previousYear.buckets.find(b => b.id === bucket.id)
    //             if (previousYearBucket) {
    //                 bucket.countDelta = bucket.count - previousYearBucket.count
    //                 bucket.percentageDelta =
    //                     Math.round(100 * (bucket.percentage - previousYearBucket.percentage)) / 100
    //             }
    //         })
    //     }
    // })
}

interface SortOptions {
    sort: string
    order: 1 | -1
    values?: string[] | number[]
}
export async function sortResults(resultsByYears: ResultsByYear[], options: SortOptions) {
    const { sort, order, values } = options
    for (let year of resultsByYears) {
        for (let facet of year.facets) {
            if (values) {
                // if values are specified, sort by values
                facet.buckets = [...facet.buckets].sort((a, b) => {
                    // make sure everything is a string to avoid type mismatches
                    const stringValues = values.map(v => v.toString())
                    return (
                        stringValues.indexOf(a.id.toString()) -
                        stringValues.indexOf(b.id.toString())
                    )
                })
            } else {
                // sort by sort/order
                facet.buckets = sortBy(facet.buckets, sort)
                if (order === -1) {
                    facet.buckets.reverse()
                }
            }
        }
    }
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
