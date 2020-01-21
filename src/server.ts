import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import typeDefs from './type_defs/schema.graphql'
import { RequestContext } from './types'
import resolvers from './resolvers'
import express from 'express'
const path = require('path')

const start = async () => {
    const mongoClient = new MongoClient(process.env!.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    const server = new ApolloServer({
        typeDefs,
        resolvers: resolvers as any,
        debug: true,
        tracing: true,
        cacheControl: true,
        introspection: true,
        playground: false,
        plugins: [responseCachePlugin()],
        engine: {
            debugPrintReports: true
        },
        context: (): RequestContext => ({
            db
        })
    })

    const app = express()

    server.applyMiddleware({ app })

    const port = process.env.PORT || 4000

    app.listen({ port: port }, () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    )
}

start()
