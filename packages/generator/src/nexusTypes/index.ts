import { enumType, inputObjectType, objectType } from 'nexus'

import { NexusAcceptedTypeDef } from 'nexus/dist/builder'
import { DMMF } from '@prisma/generator-helper'
import { getSchema, getDMMF } from '@prisma/internals'

import { ApiConfig } from '../_types/apiConfig'
import { maxBy } from 'lodash'

import { getModelRemovedFields } from './utils'
import {
  aggregate,
  findCount,
  findFirst,
  findMany,
  findUnique
} from './queries'

import {
  createOne,
  upsertOne,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany
} from './mutations'
import { ExcludeScalar, getScalars } from './scalars'

export {
  createAndNotify,
  CreateAndNotifyOptions,
  updateAndNotify,
  UpdateAndNotifyOptions,
  updateManyAndNotify,
  UpdateManyAndNotifyOptions,
  upsertAndNotify,
  UpsertAndNotifyOptions,
  deleteAndNotify,
  DeleteAndNotifyOptions,
  deleteManyAndNotify,
  DeleteManyAndNotifyOptions
} from './mutations'

type FieldConfig = {
  [key: string]: any;
  type: string;
}

interface OptionsType {
  dmmf?: DMMF.Document;
  excludeFields?: string[];
  filterInputs?: (input: DMMF.InputType) => DMMF.SchemaArg[];
  doNotUseFieldUpdateOperationsInput?: boolean;
}
const testedTypes: string[] = []
const hasEmptyTypeFields = (schema: DMMF.Schema, type: string, options?: OptionsType) => {
  testedTypes.push(type)

  const inputObjectTypes = schema ? [...schema?.inputObjectTypes.prisma] : []
  if (schema?.inputObjectTypes.model) { inputObjectTypes.push(...schema.inputObjectTypes.model) }

  const inputType = inputObjectTypes.find((item) => item.name === type)
  if (!inputType) { return false }
  if (inputType.fields.length === 0) return true

  for (const field of inputType.fields) {
    const fieldType = getInputType(field, options)
    const fieldTypeDoNotMatch = fieldType.type !== type
    const isInputObject = fieldType.location === 'inputObjectTypes'
    const alreadyTested = testedTypes.includes(fieldType.type as string)

    if (fieldTypeDoNotMatch && isInputObject && !alreadyTested) {
      const state = hasEmptyTypeFields(schema, fieldType.type as string, options)
      if (state) return true
    }
  }

  return false
}

export interface PrismaNexusPluginSettings {
  schemaPath?: string;
  doNotUseFieldUpdateOperationsInput?: boolean;
  apiConfig: ApiConfig,
  excludeScalar?: ExcludeScalar
}

export const getNexusTypes = async (settings: PrismaNexusPluginSettings) => {
  const { apiConfig } = settings
  const dbSchema = await getSchema(settings.schemaPath)
  const apiDmmf = await getDMMF({ datamodel: dbSchema })
  const apiDataConfig = apiConfig.data
  const allConfig = apiDataConfig.all || {}

  // Base types
  const nexusSchema: (NexusAcceptedTypeDef|undefined)[] = []

  const allTypes: string[] = []
  const inputsWithNoFields: string[] = []

  const data = apiDmmf.schema
  if (!data) {
    return nexusSchema
  }

  // Enums
  const enums = [...data.enumTypes.prisma]
  if (data.enumTypes.model) enums.push(...data.enumTypes.model)
  enums.forEach((item) => {
    if (allTypes.includes(item.name)) { return }

    nexusSchema.push(
      enumType({
        name: item.name,
        members: item.values
      })
    )
    allTypes.push(item.name)
  })

  // Input types
  const modelNames = apiDmmf.datamodel.models.map(m => m.name)
  const inputObjectTypes = [...data.inputObjectTypes.prisma].reverse()
  if (data.inputObjectTypes.model) { inputObjectTypes.push(...data.inputObjectTypes.model) }
  inputObjectTypes.forEach((input) => {
    const modelName = getMatchingModel(input.name, modelNames)
    const modelConfig = apiDataConfig[modelName] || {}

    let inputFields = filterInputsWithApiConfig(modelName, input, apiConfig)
    inputFields = inputFields.filter(f => !inputsWithNoFields.includes(f.inputTypes[0].type.toString()))

    if (allConfig.removeFromSchema || modelConfig.removeFromSchema || inputFields.length === 0) {
      inputsWithNoFields.push(input.name)
      return
    }
    if (allTypes.includes(input.name)) { return }

    const inputType = inputObjectType({
      nonNullDefaults: {
        input: false
      },
      name: input.name,
      definition (t) {
        inputFields.forEach((field) => {
          const inputType = getInputType(field, settings)
          const hasEmptyType = inputType.location === 'inputObjectTypes' &&
              hasEmptyTypeFields(data, inputType.type as string, {
                dmmf: apiDmmf,
                doNotUseFieldUpdateOperationsInput: settings.doNotUseFieldUpdateOperationsInput
              })

          if (!hasEmptyType) {
            const fieldConfig: FieldConfig = {
              type: inputType.type as string
            }

            if (field.isRequired) {
              t.nonNull.field(field.name, fieldConfig)
            } else if (inputType.isList) {
              t.list.field(field.name, fieldConfig)
            } else {
              t.field(field.name, fieldConfig)
            }
          }
        })
      }
    })

    nexusSchema.push(inputType)
    allTypes.push(input.name)
  })

  // Output types
  const outputsWithNoFields: string[] = []
  const outputObjectTypes = [...data.outputObjectTypes.prisma].reverse()
  outputObjectTypes
    .filter((type) => type.name.includes('Aggregate') || type.name.endsWith('CountOutputType'))
    .forEach((type) => {
      if (allTypes.includes(type.name)) { return }

      const modelName = getMatchingModel(type.name, modelNames)
      const modelConfig = apiDataConfig[modelName] || {}
      const removedFields = getModelRemovedFields(modelName, 'read', apiConfig)

      const outputFields = type.fields.filter(f => !(removedFields.includes(f.name) || outputsWithNoFields.includes(f.outputType.type.toString())))
      if (allConfig.removeFromSchema || modelConfig.removeFromSchema || outputFields.length === 0) {
        outputsWithNoFields.push(type.name)
        return
      }

      const outputType = objectType({
        nonNullDefaults: {
          output: true
        },
        name: type.name,
        definition (t) {
          outputFields.forEach((field) => {
            const fieldConfig: FieldConfig = {
              type: field.outputType.type as string
            }

            if (field.isNullable) {
              t.nullable.field(field.name, fieldConfig)
            } else if (field.outputType.isList) {
              t.list.field(field.name, fieldConfig)
            } else {
              t.field(field.name, fieldConfig)
            }
          })
        }
      })

      nexusSchema.push(outputType)
      allTypes.push(type.name)
    })

  const queryOutputTypes = data.outputObjectTypes.prisma.find(t => t.name === 'Query')
  const mutationOutputTypes = data.outputObjectTypes.prisma.find(t => t.name === 'Mutation')

  // Models
  const models = apiDmmf.datamodel.models
  models.forEach((model) => {
    if (allTypes.includes(model.name)) { return }

    const modelConfig = apiDataConfig[model.name] || {}
    const filteredFields = model.fields.filter((field) => {
      const excludeFields = getModelRemovedFields(model.name, 'read', apiConfig)
      return !excludeFields.includes(field.name)
    })

    if (allConfig.removeFromSchema || modelConfig.removeFromSchema || filteredFields.length === 0) {
      return
    }

    const nexusModel = objectType({
      nonNullDefaults: {
        output: true,
        input: false
      },
      name: model.name,
      description: model.documentation,
      definition (t) {
        filteredFields.forEach((field) => {
          const fieldConfig: FieldConfig = {
            type: field.type as string
          }

          if (!field.isRequired) {
            t.nullable.field(field.name, fieldConfig)
          } else if (field.isList) {
            t.list.field(field.name, fieldConfig)
          } else {
            t.field(field.name, fieldConfig)
          }
        })
      }
    })
    nexusSchema.push(nexusModel)
    allTypes.push(model.name)

    // Queries
    const operationsDisabled = allConfig.removeFromSchema || allConfig.disableAllOperations || modelConfig.removeFromSchema || modelConfig.disableAllOperations
    if (queryOutputTypes && !operationsDisabled) {
      const allReadConfig = allConfig?.read || {}
      const readConfig = modelConfig?.read || {}
      if (!(allReadConfig.disableAll || readConfig.disableAll)) {
        if (!(allReadConfig.disableAggregate || readConfig.disableAggregate)) {
          nexusSchema.push(aggregate(model.name, queryOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!(allReadConfig.disableFindCount || readConfig.disableFindCount)) {
          nexusSchema.push(findCount(model.name, queryOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!(allReadConfig.disableFindFirst || readConfig.disableFindFirst)) {
          nexusSchema.push(findFirst(model.name, queryOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!(allReadConfig.disableFindMany || readConfig.disableFindMany)) {
          nexusSchema.push(findMany(model.name, queryOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!(allReadConfig.disableFindUnique || readConfig.disableFindUnique)) {
          nexusSchema.push(findUnique(model.name, queryOutputTypes, apiConfig, inputsWithNoFields))
        }
      }
    }

    // Mutations
    if (mutationOutputTypes && !operationsDisabled) {
      const allCreateConfig = allConfig?.create || {}
      const createConfig = modelConfig?.create || {}
      if (!(allCreateConfig.disableAll || createConfig.disableAll)) {
        if (!(allCreateConfig.disableAll || createConfig.disableAll)) {
          nexusSchema.push(createOne(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
        }
      }

      const allUpdateConfig = allConfig?.update || {}
      const updateConfig = modelConfig?.update || {}
      if (!(allUpdateConfig.disableAll || updateConfig.disableAll)) {
        if (!(allUpdateConfig.disableUpdateOne || updateConfig.disableUpdateOne)) {
          nexusSchema.push(updateOne(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!allUpdateConfig.disableUpdateMany || updateConfig.disableUpdateMany) {
          nexusSchema.push(updateMany(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
        }
      }

      const allUpsertConfig = allConfig?.upsert || {}
      const upsertConfig = modelConfig?.upsert || {}
      if (!(allUpsertConfig.disableAll || upsertConfig.disableAll)) {
        nexusSchema.push(upsertOne(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
      }

      const allDeleteConfig = allConfig?.delete || {}
      const deleteConfig = modelConfig?.delete || {}
      if (!(allDeleteConfig.disableAll || deleteConfig.disableAll)) {
        if (!(allDeleteConfig.disableDeleteOne || deleteConfig.disableDeleteOne)) {
          nexusSchema.push(deleteOne(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
        }

        if (!(allDeleteConfig.disableDeleteMany || deleteConfig.disableDeleteMany)) {
          nexusSchema.push(deleteMany(model.name, mutationOutputTypes, apiConfig, inputsWithNoFields))
        }
      }
    }
  })

  nexusSchema.push(objectType({
    name: 'BatchPayload',
    definition (t) {
      t.nonNull.int('count')
    }
  }))
  nexusSchema.push(
    ...getScalars(settings.excludeScalar || []) as any
  )

  return nexusSchema
}

const getMatchingModel = (prismaTypeName:string, modelNames: string[]) => {
  const matchingModelNames = modelNames.filter(mn => prismaTypeName.startsWith(mn))
  const model = maxBy(matchingModelNames, (mn) => mn.length) as string
  return model
}

const filterInputsWithApiConfig = (modelName:string, input: DMMF.InputType, apiConfig: ApiConfig) => {
  if (!modelName) {
    return input.fields
  }

  const isCreateInput = input.name.toLowerCase().includes('create')
  const isUpdateInput = input.name.toLowerCase().includes('update')

  let operation:'create'|'read'|'update' = 'read'
  operation = isCreateInput ? 'create' : operation
  operation = isUpdateInput ? 'update' : operation

  const removedFields = getModelRemovedFields(modelName, operation, apiConfig)
  let fields = input.fields
  fields = fields.filter(field => {
    return !(removedFields.includes(field.name))
  })
  return fields
}

const getInputType = (field: DMMF.SchemaArg, options?: { doNotUseFieldUpdateOperationsInput?: boolean }) => {
  let index = 0
  if (
    options?.doNotUseFieldUpdateOperationsInput &&
    field.inputTypes.length > 1 &&
    (field.inputTypes[1].type as string).endsWith('FieldUpdateOperationsInput')
  ) {
    return field.inputTypes[index]
  }
  if (
    field.inputTypes.length > 1 &&
    (field.inputTypes[1].location === 'inputObjectTypes' ||
      field.inputTypes[1].isList ||
      field.inputTypes[1].type === 'Json')
  ) {
    index = 1
  }
  return field.inputTypes[index]
}
