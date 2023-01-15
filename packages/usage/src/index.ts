import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeSchema } from 'nexus'
import { getNexusTypes, ApiConfig } from 'prisma-nexus-api'
import { PrismaClient } from '@prisma/client'
import { applyMiddleware } from 'graphql-middleware'
import { PrismaSelect } from '@paljs/plugins'

const prisma = new PrismaClient()

const apiConfig:ApiConfig = {
  prisma,
  data: {
    all: {}
  }
}

const getSchema = async () => {
  const types = await getNexusTypes({
    apiConfig
  })

  const schema = makeSchema({
    types,
    outputs: {
      schema: path.join(__dirname, './generated/nexus/schema.graphql'),
      typegen: path.join(__dirname, './generated/nexus/nexus.ts')
    }
  })

  const prismaSelect = async (resolve: any, root:any, args:any, ctx: any, info:any) => {
    ctx.select = new PrismaSelect(info).value
    return resolve(root, args, ctx, info)
  }

  return applyMiddleware(schema, prismaSelect)
}

const start = async () => {
  const schema = await getSchema()

  const server = new ApolloServer({
    schema
  })

  // TODO: Convert to express, setup websocket/subscriptions
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      return { prisma, req }
    }
  })

  console.log(`🚀  Server ready at: ${url}`)
}

start()
