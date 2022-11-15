import fs from 'fs'
import path from 'path'
import { intersection } from 'lodash'
import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast'

import {
  ApiConfig,
  ModelConfiguration
} from '../_types'

export const isModelDisabled = (modelApiConfiguration?: ModelConfiguration) => {
  if (!modelApiConfiguration) { return false }

  const createDisabled = modelApiConfiguration?.create?.disabled
  const readDisabled = modelApiConfiguration?.read?.disabled
  const updateDisabled = modelApiConfiguration?.update?.disabled
  const deleteDisabled = modelApiConfiguration?.delete?.disabled

  const modelDisabled = createDisabled &&
      readDisabled &&
      updateDisabled &&
      deleteDisabled

  return modelDisabled
}

export const getDisabledFields = (modelApiConfiguration?: ModelConfiguration) => {
  // excludedCreateFields means removed from create inputs
  const excludedCreateFields = modelApiConfiguration?.create?.removedFields || []

  // excludedReadFields means removed from read inputs/outputs
  const excludedReadFields = modelApiConfiguration?.read?.removedFields || []

  // excludedUpdateFields means removed from update inputs
  const excludedUpdateFields = modelApiConfiguration?.update?.removedFields || []

  return intersection<string>(excludedCreateFields, excludedReadFields, excludedUpdateFields)
}

export type GenerateNexusTypesOptions = {
  schemaPath: string;
  outputPath: string;
  apiConfig: ApiConfig;
}

export const genPrismaApiSchema = async (options: GenerateNexusTypesOptions) => {
  const { schemaPath, outputPath, apiConfig } = options

  const configuredModels = Object.keys(apiConfig)

  const source = fs.readFileSync(schemaPath, 'utf8')
  const builder = createPrismaSchemaBuilder(source)

  for (let i = 0; i < configuredModels.length; i++) {
    const modelName = configuredModels[i]
    const config = apiConfig[modelName as (keyof ApiConfig)]

    const modelDisabled = isModelDisabled(config)
    if (modelDisabled) {
      builder.drop(modelName)
      continue
    }

    const disabledFields = getDisabledFields(config)
    for (let j = 0; j < disabledFields.length; j++) {
      builder.dropField(modelName, disabledFields[j])
    }
  }

  const schemaString = builder.print()

  const apiSchemaPath = path.join(outputPath, 'apiSchema.prisma')
  fs.writeFileSync(apiSchemaPath, schemaString)
}
