#!/usr/bin/env node
import path from 'path'
import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/internals'

import { genApiConfigTypes } from './genApiConfigTypes'

const { version, name } = require('../../package.json')
const defaultOutputPath = path.join(__dirname, '../generated')

generatorHandler({
  onManifest () {
    logger.info(`${name}:Registered`)
    return {
      version,
      defaultOutput: defaultOutputPath,
      prettyName: name
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    await genApiConfigTypes(options.dmmf.datamodel)
  }
})
