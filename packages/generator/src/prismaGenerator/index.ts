#!/usr/bin/env node
import path from 'path'
import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/internals'

import { genApiConfigTypes } from './genApiConfigTypes'
import { genApiConfigAccessRules } from './genApiConfigAccessRules'
import { writeFileSafely } from '../utils/writeFileSafely'

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
    let contents = await genApiConfigAccessRules(options.dmmf.datamodel)
    contents += await genApiConfigTypes(options.dmmf.datamodel)

    const pluginSettingsTypePath = path.join(__dirname, '../_types/apiConfig.d.ts')
    await writeFileSafely(pluginSettingsTypePath, contents)
  }
})
