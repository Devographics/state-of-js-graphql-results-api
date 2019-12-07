import * as Apollo from 'apollo-server'
const { ApolloServer } = Apollo.default
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import typeDefs from './type_defs.mjs'
import resolvers from './resolvers.mjs'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    cacheControl: true,
    plugins: [responseCachePlugin()],
    engine: {
        debugPrintReports: true
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})
