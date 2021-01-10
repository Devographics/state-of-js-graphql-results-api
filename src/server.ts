import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from 'apollo-server-express'
import { MongoClient } from 'mongodb'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import typeDefs from './type_defs/schema.graphql'
import { RequestContext } from './types'
import resolvers from './resolvers'
import express from 'express'
import config from './config'
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const app = express()

const environment = process.env.ENVIRONMENT || process.env.NODE_ENV;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
    integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    // new Tracing.Integrations.Express({ app }),
  ],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  environment,
});

const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const start = async () => {
    const mongoClient = new MongoClient(process.env!.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000
    })
    await mongoClient.connect()
    const db = mongoClient.db(process.env.MONGO_DB_NAME)

    // purge db cache
    // const collection = db.collection(config.mongo.cache_collection)
    // collection.deleteMany({})

    const server = new ApolloServer({
        typeDefs,
        resolvers: resolvers as any,
        debug: isDev,
        tracing: isDev,
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

    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    // app.use(Sentry.Handlers.tracingHandler());

    server.applyMiddleware({ app })

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/public/welcome.html'))
    })

    app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
    });

    app.use(Sentry.Handlers.errorHandler());

    const port = process.env.PORT || 4000

    app.listen({ port: port }, () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    )

    
}

start()
