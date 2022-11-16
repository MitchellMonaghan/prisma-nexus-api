import path from 'path'
import { getDMMF, getSchema as getPrismaSchema } from '@prisma/internals'
import { makeSchema } from 'nexus'
import { paljs } from '@quickmicro/nexus-plugin'

import apiConfig from './apiConfig.json'
import * as types from './generated'

// Generate prisma dmmf to pass to paljs, we have a different schema for the exposed api
export const getSchema = async () => {
  const schemaPath = path.resolve(__dirname, './generated/apiSchema.prisma')
  const datamodel = await getPrismaSchema(schemaPath)
  const dmmf = await getDMMF({ datamodel })

  makeSchema({
    types,
    plugins: [
      paljs({
        dmmf: [dmmf],
        apiConfig
      })
    ],
    outputs: {
      schema: path.join(__dirname, './generated/nexus/schema.graphql'),
      typegen: path.join(__dirname, './generated/nexus/nexus.ts')
    }
  })
}

getSchema()
