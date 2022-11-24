import { intersection } from 'lodash'
import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast'

import {
  ApiConfig,
  ModelConfiguration
} from '../_types'

export const isModelDisabled = (modelApiConfiguration?: ModelConfiguration) => {
  if (!modelApiConfiguration) { return false }

  const upsertDisabled = modelApiConfiguration?.upsert?.disableAll

  const allCreatesDisabled = modelApiConfiguration?.create?.disableAll && upsertDisabled

  const createDisabled = modelApiConfiguration?.create?.disableAll || allCreatesDisabled

  const allReadsDisabled = modelApiConfiguration?.read?.disableAggregate &&
    modelApiConfiguration?.read?.disableFindCount &&
    modelApiConfiguration?.read?.disableFindFirst &&
    modelApiConfiguration?.read?.disableFindMany &&
    modelApiConfiguration?.read?.disableFindUnique

  const readDisabled = modelApiConfiguration?.read?.disableAll || allReadsDisabled

  const allUpdatesDisabled = modelApiConfiguration?.update?.disableUpdateOne &&
  modelApiConfiguration?.update?.disableUpdateMany && upsertDisabled

  const updateDisabled = modelApiConfiguration?.update?.disableAll || allUpdatesDisabled

  const allDeletesDisabled = modelApiConfiguration?.delete?.disableDeleteOne &&
  modelApiConfiguration?.delete.disableDeleteMany

  const deleteDisabled = modelApiConfiguration?.delete?.disableAll || allDeletesDisabled

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
  dbSchema: string;
  apiConfig: ApiConfig;
}

export const getPrismaApiSchema = async (options: GenerateNexusTypesOptions) => {
  const { dbSchema, apiConfig } = options

  const configuredModels = Object.keys(apiConfig)

  const builder = createPrismaSchemaBuilder(dbSchema)

  for (let i = 0; i < configuredModels.length; i++) {
    const modelName = configuredModels[i]
    const config = apiConfig.data[modelName as (keyof ApiConfig)]

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
