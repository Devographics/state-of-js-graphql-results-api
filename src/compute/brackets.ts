import { Db } from 'mongodb'
import { Completion, SurveyConfig } from '../types'
import { TermAggregationOptions, RawResult, groupByYears } from '../compute/generic'
import config from '../config'
import { generateFiltersQuery } from '../filters'
import { inspect } from 'util'
import idsLookupTable from '../data/ids.yml'
import { getWinsPipeline, getMatchupsPipeline } from './brackets_pipelines'

// Wins

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
    year: number
}

export interface WinsYearAggregations {
    year: number
    total: number
    completion: Completion
    buckets: WinsBucket[]
}

// Matchups

export interface MatchupAggregationResult {
    id: number
    year: number
    matchups: MatchupStats[]
}

export interface MatchupStats {
    id: number | string
    count: number
    percentage: number
}

export interface MatchupBucket {
    id: number | string
    matchups: MatchupStats[]
}

export interface MatchupYearAggregations {
    year: number
    total: number
    completion: Completion
    buckets: MatchupBucket[]
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

    const winsPipeline = getWinsPipeline(match, key)

    const rawResults = (await collection.aggregate(winsPipeline).toArray()) as WinsBucket[]

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
    const resultsByYear = await groupByYears(resultsWithId, db, survey, match)
    
    // console.log(JSON.stringify(resultsByYear, '', 2))
    return resultsByYear
}

export const matchupsAggregationFunction = async (
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

    const matchupsPipeline = getMatchupsPipeline(match, key)
    const rawResults = (await collection.aggregate(matchupsPipeline).toArray()) as MatchupAggregationResult[]

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

    // add proper ids
    // const resultsWithId = rawResults.map(result => ({
    //     ...result,
    //     id: idsLookupTable[key][result.id]
    // }))
    rawResults.forEach(result => {
        result.id = idsLookupTable[key][result.id]
        result.matchups = result.matchups.map(matchup => ({
            ...matchup,
            id: idsLookupTable[key][matchup.id]
        }))
    })

    // console.log('// resultsWithId')
    // console.log(JSON.stringify(rawResults, '', 2))

    // group by years and add counts
    const resultsByYear = await groupByYears(rawResults, db, survey, match)

    // console.log('// resultsByYear')
    // console.log(JSON.stringify(resultsByYear, '', 2))

    return resultsByYear
}
