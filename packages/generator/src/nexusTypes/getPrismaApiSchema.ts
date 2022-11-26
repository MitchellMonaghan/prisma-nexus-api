import { intersection } from 'lodash'
import { createPrismaSchemaBuilder } from '@mrleebo/prisma-ast'

import { ApiConfig } from '../_types'
import { getModelRemovedFields } from './utils'

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

  const allConfiguration = apiConfig.data.all || {}
  for (let i = 0; i < configuredModels.length; i++) {
    const modelName = configuredModels[i]
    const modelApiConfiguration = apiConfig.data[modelName as (keyof ApiConfig)] || {}

    const modelDisabled = allConfiguration?.removeFromSchema || modelApiConfiguration?.removeFromSchema
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
