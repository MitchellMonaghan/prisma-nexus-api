import path from 'path'
import {
  QueriesAndMutations,
  Query,
  Mutation
} from '@paljs/types'

import { GenerateNexus } from './generator'

import { ApiConfig, ModelConfiguration } from '../../_types'

const getExcludedOperations = (modelApiConfiguration?: ModelConfiguration) => {
  const createQueries = ['createOne'] as Mutation[]

  const readQueries = [
    'findUnique',
    'findFirst',
    'findMany',
    'findCount',
    'aggregate'
  ] as Query[]

  const updateMutations = [
    'updateOne',
    'updateMany'
  ] as Mutation[]

  const upsertMutations = ['upsertOne'] as Mutation[]

  const deleteMutations = [
    'deleteOne',
    'deleteMany'
  ] as Mutation[]

  const createDisabled = modelApiConfiguration?.create?.disabled
  const readDisabled = modelApiConfiguration?.read?.disabled
  const updateDisabled = modelApiConfiguration?.update?.disabled
  const deleteDisabled = modelApiConfiguration?.delete?.disabled

  const modelExcludedOperations = [] as QueriesAndMutations[]
  if (createDisabled) {
    modelExcludedOperations.push(...createQueries)
  }

  if (readDisabled) {
    modelExcludedOperations.push(...readQueries)
  }

  if (updateDisabled) {
    modelExcludedOperations.push(...updateMutations)
  }

  if (createDisabled || updateDisabled) {
    modelExcludedOperations.push(...upsertMutations)
  }

  if (deleteDisabled) {
    modelExcludedOperations.push(...deleteMutations)
  }

  return modelExcludedOperations
}

const getExcludedFields = (modelApiConfiguration?: ModelConfiguration) => {
  return modelApiConfiguration?.read?.removedFields || []
}

export type GenerateNexusTypesOptions = {
  outputPath: string;
  apiConfig: ApiConfig;
}

const generateQueriesAndMutations = async (apiSchemaPath: string, options: GenerateNexusTypesOptions) => {
  const { outputPath, apiConfig } = options

  const configuredModels = Object.keys(apiConfig)

  const excludeQueriesAndMutationsByModel = {} as Record<string, QueriesAndMutations[]>
  const excludeFieldsByModel = {} as Record<string, string[]>

  for (let i = 0; i < configuredModels.length; i++) {
    const modelName = configuredModels[i]
    const config = apiConfig[modelName as (keyof ApiConfig)]

    excludeQueriesAndMutationsByModel[modelName] = getExcludedOperations(config)
    excludeFieldsByModel[modelName] = getExcludedFields(config)
  }

  // Generate queries/mutations
  const generator = new GenerateNexus(apiSchemaPath, {
    output: outputPath,
    disableTypes: true,
    disableInputTypes: true,
    excludeQueriesAndMutationsByModel,
    excludeFieldsByModel
  })

  await generator.run()
}

export const genNexusTypes = async (options: GenerateNexusTypesOptions) => {
  const apiSchemaPath = path.join(options.outputPath, 'apiSchema.prisma')

  await generateQueriesAndMutations(apiSchemaPath, options)
}
