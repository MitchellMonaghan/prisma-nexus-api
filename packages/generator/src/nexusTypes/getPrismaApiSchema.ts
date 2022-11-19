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
  const excludedCreateFields = modelApiConfiguration?.create?.removedFields?.map((rf) => {
    if (typeof rf === 'string') {
      return rf
    } else {
      return rf.fieldName
    }
  }) || []

  // excludedReadFields means removed from read inputs/outputs
  const excludedReadFields = modelApiConfiguration?.read?.removedFields || []

  // excludedUpdateFields means removed from update inputs
  const excludedUpdateFields = modelApiConfiguration?.update?.removedFields || []

  return intersection<string>(excludedCreateFields, excludedReadFields, excludedUpdateFields)
}

export type GenerateNexusTypesOptions = {
  dbSchema: string;
  apiConfig: ApiConfig;
}

export const getPrismaApiSchema = async (options: GenerateNexusTypesOptions) => {
  const { dbSchema, apiConfig } = options

  const configuredModels = Object.keys(apiConfig)

  const builder = createPrismaSchemaBuilder(dbSchema)

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
  return schemaString
}