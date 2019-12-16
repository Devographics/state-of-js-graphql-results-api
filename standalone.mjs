import util from 'util'
import dotenv from 'dotenv'
dotenv.config()
import * as Mongo from 'mongodb'
const { MongoClient } = Mongo.default
import {
    computeParticipationByYear,
    computeGenderBreakdownByYear,
    computeExperienceOverYears,
    computeFeatureUsageByYear,
    computeSalaryRangeByYear,
    computeCompanySizeByYear,
    computeYearsOfExperienceByYear,
    getParticipationByYearMap,
    computeOpinionByYear,
    computeOpinionsByYear,
    computeHappinessByYear,
    computeToolsExperience,
    computeToolsExperienceRanking,
    computeToolsMatrix,
} from './src/analysis/index.mjs'

const run = async () => {
    const mongoClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    const res = await computeToolsMatrix(db, [
        'jest',
        'mocha',
        'storybook',
        'cypress',
        'enzyme',
        'ava',
        'jasmine',
        'puppeteer'
    ], 'would_use', 'company_size', 2019, { survey: 'js', year: 2019 })
    console.log(util.inspect(res, { depth: null, colors: true }))

    await mongoClient.close()
}

run()
