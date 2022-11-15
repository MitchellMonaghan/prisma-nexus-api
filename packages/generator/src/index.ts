import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/internals'

import { getConfig } from './utils/getConfigFile'
import { genApiConfigTypes } from './helpers/genApiConfigTypes'
import { genPrismaApiSchema } from './helpers/genPrismaApiSchema'
import { genNexusTypes } from './helpers/genNexusTypes'
import { ApiConfig } from './_types'

const { version, name } = require('../package.json')
const defaultOutputPath = '../generated'
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
    const outputPath = options.generator.output?.value || defaultOutputPath

    await genApiConfigTypes(outputPath, options.dmmf.datamodel)

    const apiConfigPath = options.generator.config.apiConfigPath
    const apiConfig = (await getConfig<ApiConfig>(apiConfigPath)) ||
        ({} as ApiConfig)

    await genPrismaApiSchema({
      outputPath,
      schemaPath: options.schemaPath,
      apiConfig
    })

    await genNexusTypes({
      outputPath,
      apiConfig
    })

    // TODO: Nexus input types
  }
})
