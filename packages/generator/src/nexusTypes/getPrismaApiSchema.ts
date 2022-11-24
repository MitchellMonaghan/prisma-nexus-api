import { intersection } from 'lodash'
import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast'

import { ApiConfig } from '../_types'
import { getModelRemovedFields } from './utils'

export const isModelDisabled = (modelName:string, apiConfig: ApiConfig) => {
  const allConfiguration = apiConfig.data.all || {}
  const modelApiConfiguration = apiConfig.data[modelName as (keyof ApiConfig)] || {}

  // Create
  const createDisabled = allConfiguration?.create?.disableAll || modelApiConfiguration?.create?.disableAll

  // Read
  const disableAggregate = allConfiguration?.read?.disableAggregate || modelApiConfiguration?.read?.disableAggregate
  const disableFindCount = allConfiguration?.read?.disableFindCount || modelApiConfiguration?.read?.disableFindCount
  const disableFindFirst = allConfiguration?.read?.disableFindFirst || modelApiConfiguration?.read?.disableFindFirst
  const disableFindMany = allConfiguration?.read?.disableFindMany || modelApiConfiguration?.read?.disableFindMany
  const disableFindUnique = allConfiguration?.read?.disableFindUnique || modelApiConfiguration?.read?.disableFindUnique
  const allReadsDisabled = disableAggregate &&
    disableFindCount &&
    disableFindFirst &&
    disableFindMany &&
    disableFindUnique
  const readDisabled = allConfiguration?.read?.disableAll || modelApiConfiguration?.read?.disableAll || allReadsDisabled

  // Update
  const updateOnedisabled = allConfiguration?.update?.disableUpdateOne || modelApiConfiguration?.update?.disableUpdateOne
  const updateManydisabled = allConfiguration?.update?.disableUpdateMany || modelApiConfiguration?.update?.disableUpdateMany
  const allUpdatesDisabled = updateOnedisabled && updateManydisabled
  const updateDisabled = allConfiguration?.update?.disableAll || modelApiConfiguration?.update?.disableAll || allUpdatesDisabled

  // Upsert
  const upsertDisabled = allConfiguration?.upsert?.disableAll || modelApiConfiguration?.upsert?.disableAll

  // Delete
  const deleteOneDisabled = allConfiguration?.delete?.disableDeleteOne || modelApiConfiguration?.delete?.disableDeleteOne
  const deleteManyDisabled = allConfiguration?.delete?.disableDeleteMany || modelApiConfiguration?.delete?.disableDeleteMany
  const allDeletesDisabled = deleteOneDisabled && deleteManyDisabled
  const deleteDisabled = allConfiguration?.delete?.disableAll || modelApiConfiguration?.delete?.disableAll || allDeletesDisabled

  const modelDisabled = createDisabled &&
      readDisabled &&
      updateDisabled &&
      upsertDisabled &&
      deleteDisabled

  return modelDisabled
}

export const getDisabledFields = (modelName:string, apiConfig: ApiConfig) => {
  // excludedCreateFields means removed from create inputs
  const excludedCreateFields = getModelRemovedFields(modelName, 'create', apiConfig)

  // excludedReadFields means removed from read inputs/outputs
  const excludedReadFields = getModelRemovedFields(modelName, 'read', apiConfig)

  // excludedUpdateFields means removed from update inputs
  const excludedUpdateFields = getModelRemovedFields(modelName, 'update', apiConfig)

  return intersection<string>(excludedCreateFields, excludedReadFields, excludedUpdateFields)
}

export type GenerateNexusTypesOptions = {
  dbSchema: string;
  apiConfig: ApiConfig;
}

export const getPrismaApiSchema = async (options: GenerateNexusTypesOptions) => {
  const { dbSchema, apiConfig } = options

  const configuredModels = Object.keys(apiConfig).filter(m => m !== 'all')

  const builder = createPrismaSchemaBuilder(dbSchema)

  for (let i = 0; i < configuredModels.length; i++) {
    const modelName = configuredModels[i]

    const modelDisabled = isModelDisabled(modelName, apiConfig)
    if (modelDisabled) {
      builder.drop(modelName)
      continue
    }

    const disabledFields = getDisabledFields(modelName, apiConfig)
    for (let j = 0; j < disabledFields.length; j++) {
      builder.dropField(modelName, disabledFields[j])
    }
  }

  const schemaString = builder.print()
  return schemaString
}
