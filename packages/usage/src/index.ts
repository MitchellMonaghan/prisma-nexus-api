import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeSchema } from 'nexus'
import { getNexusTypes, ApiConfig } from '@quickmicro/prisma-generator-quick-micro'
import { paljs } from '@paljs/nexus'

const apiConfig:ApiConfig = {
  User: {
    create: { removedFields: [] },
    read: { removedFields: [] },
    update: { removedFields: [] }
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
    listen: { port: 4000 }
  })

  console.log(`🚀  Server ready at: ${url}`)
}

start()
