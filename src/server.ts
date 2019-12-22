import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from 'apollo-server'
import { MongoClient } from 'mongodb'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import schema from './types/schema.graphql'
import { RequestContext } from './types'
import resolvers from './resolvers'

console.log(resolvers)

const start = async () => {
    const mongoClient = new MongoClient(process.env!.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
        tracing: true,
        cacheControl: true,
        introspection: true,
        playground: true,
        plugins: [responseCachePlugin()],
        engine: {
            debugPrintReports: true
        },
        context: (): RequestContext => ({
            db
        })
    })

    // see https://stackoverflow.com/a/15693371/649299
    server.listen(process.env.PORT || 4000).then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`)
    })
}

start()
