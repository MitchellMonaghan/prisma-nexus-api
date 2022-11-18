import path from 'path'
import { makeSchema } from 'nexus'
import { paljs } from '@paljs/nexus'

import * as types from './generated'

// Generate prisma dmmf to pass to paljs, we have a different schema for the exposed api
export const getSchema = async () => {
  makeSchema({
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

getSchema()
