import util from 'util'
import dotenv from 'dotenv'
dotenv.config()
import * as Mongo from 'mongodb'
const { MongoClient } = Mongo
/*
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
    computeSalaryByJobTitle
} from './analysis'
*/
const run = async () => {
    const mongoClient = new MongoClient(process.env!.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    /*
    const res = await computeToolsMatrix(
        db,
        {},
        {
            survey: { survey: 'js' },
            ids: ['typescript', 'reason', 'elm', 'clojurescript', 'purescript'],
            year: 2019,
            experience: 'would_user',
            subType: 'salary'
        }
    )
    console.log(util.inspect(res, { depth: null, colors: true }))

    await mongoClient.close()
     */
}

run()
