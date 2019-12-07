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
    getOpinionIds,
    computeOpinionByYear,
    computeOpinionsByYear,
    computeHappinessByYear,
} from './src/analysis/index.mjs'

const run = async () => {
    const mongoClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    const res = await computeHappinessByYear(db, 'javascript_flavors')
    console.log(util.inspect(res, { depth: null, colors: true }))

    await mongoClient.close()
}

run()