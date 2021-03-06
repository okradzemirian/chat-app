import '@babel/polyfill/noConflict'
import http from 'http'
import {
    ApolloServer,
    PubSub,
    AuthenticationError,
} from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import { importSchema } from 'graphql-import'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import resolvers from './resolvers/resolvers'

const startServer = async () => {
    const app = express()

    app.use(helmet())
    app.use(cookieParser())
    app.disable('x-powered-by')

    const pubsub = new PubSub()

    const server = new ApolloServer({
        typeDefs: importSchema('./src/schema.graphql'),
        resolvers,
        context: ({ req, res, connection }) => {
            if (connection) {
                return {
                    req: connection.context,
                    pubsub,
                }
            }
            return {
                req,
                res,
                pubsub,
            }
        },
        subscriptions: {
            onConnect(_, webSocket) {
                try {
                    const token = webSocket.upgradeReq.headers.cookie.split(
                        '=',
                    )[1]

                    return {
                        cookies: {
                            token,
                        },
                    }
                } catch (e) {
                    throw new AuthenticationError('NO_AUTH')
                }
            },
        },
    })

    server.applyMiddleware({
        app,
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    })

    const httpServer = http.createServer(app)

    server.installSubscriptionHandlers(httpServer)

    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        autoIndex: false,
    })

    const PORT = process.env.PORT || 4000

    httpServer.listen(PORT, () => {
        console.log(
            `🚀 Server ready at http://${process.env.CLIENT_URL}:${PORT}${server.graphqlPath}`,
        )
        console.log(
            `🚀 Subscriptions ready at ws://${process.env.CLIENT_URL}:${PORT}${server.subscriptionsPath}`,
        )
    })
}

startServer()
