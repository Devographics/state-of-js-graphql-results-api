import dotenv from 'dotenv'
dotenv.config()
import * as Apollo from 'apollo-server'
const { ApolloServer } = Apollo.default
import * as Mongo from 'mongodb'
const { MongoClient } = Mongo.default
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import typeDefs from './src/type_defs.mjs'
import resolvers from './src/resolvers.mjs'

const startServer = async () => {
    const mongoClient = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 1000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        tracing: true,
        cacheControl: true,
        plugins: [
            responseCachePlugin(),
        ],
        engine: {
            debugPrintReports: true,
        },
        context: () => {
            return {
                db
            }
        }
    })

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`)
    })
}

startServer()
