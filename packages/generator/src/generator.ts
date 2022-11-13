import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import { genApiConfig } from './helpers/genApiConfig'

const { version, name } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${name}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: name,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    await genApiConfig(options.generator.output?.value!, options.dmmf.datamodel)
  },
})
