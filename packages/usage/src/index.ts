import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeSchema } from 'nexus'
import { getNexusTypes, ApiConfig } from 'prisma-nexus-api'
import { paljs } from '@paljs/nexus'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiConfig:ApiConfig = {
  data: {
    User: {
      create: {
        access: [
          { property: 'email', operator: { name: 'eq', value: '' } },
          {
            property: 'or',
            value: [
              { property: 'id', operator: { name: 'eq', value: 3 } },
              { property: 'id', operator: { name: 'gt', value: 43 } }
            ]
          },
          {
            property: 'exists',
            table: 'Car',
            where: [
              { property: 'maxSpeed', operator: { name: 'eq', value: 5 } }
            ]
          }
        ]
      }
    }
  }
}

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

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      return { prisma, req }
    }
  })

  console.log(`🚀  Server ready at: ${url}`)
}

start()
