import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeSchema } from 'nexus'
import { getNexusTypes, ApiConfig } from 'prisma-nexus-api'
import { paljs } from '@paljs/nexus'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiConfig:ApiConfig = { data: {} }

const getSchema = async () => {
  const types = await getNexusTypes({
    apiConfig
  })

  return makeSchema({
    types,
    plugins: [
      paljs()
    ],
    outputs: {
      schema: path.join(__dirname, './generated/nexus/schema.graphql'),
      typegen: path.join(__dirname, './generated/nexus/nexus.ts')
    }
  })
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
