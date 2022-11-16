import path from 'path'
import { makeSchema } from 'nexus'
import { paljs } from '@quickmicro/nexus-plugin'

import apiConfig from './apiConfig.json'
import * as types from './generated'

makeSchema({
  types,
  plugins: [
    paljs({
      apiConfig
    })
  ],
  outputs: {
    schema: path.join(__dirname, './generated/nexus/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus/nexus.ts')
  }
})
