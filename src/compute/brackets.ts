import { Db } from 'mongodb'
import { Completion, SurveyConfig } from '../types'
import {
    TermAggregationOptions,
    RawResult,
    groupByYears
} from '../compute/generic'
import config from '../config'
import { generateFiltersQuery } from '../filters'
import { inspect } from 'util'
import idsLookupTable from '../data/ids.yml'
import { getWinsPipeline, getMatchupsPipeline } from './brackets_pipelines'

export interface WinsStats {
    count: number
    percentage: number
}

export interface WinsBucket {
    id: number | string
    round1: WinsStats
    round2: WinsStats
    round3: WinsStats
    combined: WinsStats
}

export interface WinsYearAggregations {
    year: number
    total: number
    completion: Completion
    buckets: WinsBucket[]
}

export const winsAggregationFunction = async (
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions = {}
) => {

    const collection = db.collection(config.mongo.normalized_collection)

    const { filters, sort = 'total', order = -1, year }: TermAggregationOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, '', []] },
        ...generateFiltersQuery(filters)
    }
    // if year is passed, restrict aggregation to specific year
    if (year) {
        match.year = year
    }

    const winsPipeline = getWinsPipeline(key)

    const rawResults = (await collection.aggregate(winsPipeline).toArray()) as RawResult[]

    console.log(
        inspect(
            {
                match,
                winsPipeline,
                rawResults
            },
            { colors: true, depth: null }
        )
    )

    // add proper ids
    const resultsWithId = rawResults.map(result => ({
        ...result,
        id: idsLookupTable[key][result.id]
    }))

    // group by years and add counts
    // TODO: figure out better way to "convert" RawResult type to WinBucket type
    const resultsByYear = <WinsYearAggregations[]><unknown>await groupByYears(resultsWithId, db, survey, match)

    // console.log(JSON.stringify(resultsByYear, '', 2))
    return resultsByYear
}

// export async function groupByYears(
//     results: RawResult[],
//     db: Db,
//     survey: SurveyConfig,
//     match: any
// ) {
//     const years = uniq(results.map(r => r.year))

//     const totalRespondentsByYear = await getParticipationByYearMap(db, survey)
//     const completionByYear = await computeCompletionByYear(db, match)

//     const resultsWithYears = years.map((year: number) => {
//         const totalRespondents = totalRespondentsByYear[year] ?? 0
//         const completionCount = completionByYear[year]?.total ?? 0

//         const buckets = results
//             .filter(r => r.year === year)

//         const yearBucket = {
//             year,
//             total: totalRespondents,
//             completion: {
//                 total: totalRespondents,
//                 count: completionCount,
//                 percentage: ratioToPercentage(completionCount / totalRespondents)
//             },
//             buckets
//         }
//         return yearBucket
//     })

//     return orderBy(resultsWithYears, 'year')
// }

export const matchupsAggregationFunction = async (
    db: Db,
    survey: SurveyConfig,
    key: string,
    options: TermAggregationOptions = {}
) => {
    console.log('// matchupsAggregationFunction')
    console.log(key)
    console.log(options)

    const collection = db.collection(config.mongo.normalized_collection)

    const { filters, sort = 'total', order = -1, year }: TermAggregationOptions = options

    const match: any = {
        survey: survey.survey,
        [key]: { $nin: [null, '', []] },
        ...generateFiltersQuery(filters)
    }

    // if year is passed, restrict aggregation to specific year
    if (year) {
        match.year = year
    }

    

    const matchupsPipeline = getMatchupsPipeline(key)
    const rawResults = (await collection.aggregate(matchupsPipeline).toArray()) as RawResult[]

    console.log(
        inspect(
            {
                match,
                matchupsPipeline,
                rawResults
            },
            { colors: true, depth: null }
        )
    )

    // const totalMatches = sumBy(rawResults, 'total')

    // add proper ids
    // const resultsWithId = rawResults.map(result => ({
    //     ...result,
    //     id: idsLookupTable[key][result.id]
    // }))

    // const totalRespondentsByYear = await getParticipationByYearMap(db, survey)
    // const completionByYear = await computeCompletionByYear(db, match)

    // group by years and add counts
    // const resultsByYear = orderBy(
    //     resultsWithId.reduce((acc: YearAggregations[], result) => {
    //         let yearBucket = acc.find(b => b.year === result.year)
    //         if (yearBucket === undefined) {
    //             const totalRespondents = totalRespondentsByYear[result.year] ?? 0
    //             const completionCount = completionByYear[result.year]?.total ?? 0

    //             yearBucket = {
    //                 year: result.year,
    //                 total: totalRespondents,
    //                 completion: {
    //                     total: totalRespondents,
    //                     count: completionCount,
    //                     percentage: ratioToPercentage(completionCount / totalRespondents)
    //                 },
    //                 buckets: []
    //             }

    //             acc.push(yearBucket)
    //         }

    //         yearBucket.buckets.push({
    //             id: result.id,
    //             entity: result.entity,
    //             count: result.total,
    //             percentage: 0
    //         })

    //         return acc
    //     }, []),
    //     'year'
    // )

    // compute percentages
    // resultsByYear.forEach(year => {
    //     year.buckets.forEach(bucket => {
    //         bucket.percentage = ratioToPercentage(bucket.count / totalMatches)
    //     })
    // })

    // compute deltas
    // resultsByYear.forEach((year, i) => {
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

    // return resultsByYear
    return []
}
