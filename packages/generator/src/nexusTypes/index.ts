import { getInputType } from '@paljs/utils'
import { enumType, inputObjectType, objectType } from 'nexus'

import { NexusAcceptedTypeDef } from 'nexus/dist/builder'
import { DMMF } from '@prisma/generator-helper'
import { getSchema, getDMMF } from '@prisma/internals'

import { ApiConfig } from '../_types/apiConfig'
import { maxBy } from 'lodash'

import { getPrismaApiSchema } from './getPrismaApiSchema'

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
  prismaSelectOptions?: {
    defaultFields?: {
      [key: string]:
        | { [key: string]: boolean }
        | ((select: any) => { [key: string]: boolean });
    };
    dmmf?: DMMF.Document[];
  };
  schemaPath?: string;
  doNotUseFieldUpdateOperationsInput?: boolean;
  apiConfig: ApiConfig
}

export const getNexusTypes = async (settings: PrismaNexusPluginSettings) => {
  const { apiConfig } = settings
  const dbSchema = await getSchema(settings.schemaPath)
  const apiSchema = await getPrismaApiSchema({
    dbSchema,
    apiConfig
  })
  const apiDmmf = await getDMMF({ datamodel: apiSchema })

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
    let inputFields = filterInputsWithApiConfig(modelName, input, settings.apiConfig)
    inputFields = inputFields.filter(f => !inputsWithNoFields.includes(f.inputTypes[0].type.toString()))

    if (inputFields.length === 0) {
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
                dmmf: apiDmmf
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
      const modelConfig = settings.apiConfig[modelName] || {}
      const removedFields = modelConfig?.read?.removedFields || []

      const outputFields = type.fields.filter(f => !(removedFields.includes(f.name) || outputsWithNoFields.includes(f.outputType.type.toString())))
      if (outputFields.length === 0) {
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

    const modelConfig = settings.apiConfig[model.name]
    const filteredFields = model.fields.filter((field) => {
      const excludeFields = modelConfig?.read?.removedFields || []
      return !excludeFields.includes(field.name)
    })

    if (filteredFields.length === 0) {
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
    if (queryOutputTypes) {
      const readConfig = modelConfig?.read || {}
      if (!readConfig.disabled) {
        nexusSchema.push(aggregate(model.name, queryOutputTypes, inputsWithNoFields))
        nexusSchema.push(findCount(model.name, queryOutputTypes, inputsWithNoFields))
        nexusSchema.push(findFirst(model.name, queryOutputTypes, inputsWithNoFields))
        nexusSchema.push(findMany(model.name, queryOutputTypes, inputsWithNoFields))
        nexusSchema.push(findUnique(model.name, queryOutputTypes, inputsWithNoFields))
      }
    }

    // Mutations
    if (mutationOutputTypes) {
      const createConfig = modelConfig?.create || {}
      if (!createConfig.disabled) {
        nexusSchema.push(createOne(model.name, mutationOutputTypes, createConfig, inputsWithNoFields))
      }

      const updateConfig = modelConfig?.update || {}
      if (!updateConfig.disabled) {
        nexusSchema.push(updateOne(model.name, mutationOutputTypes, updateConfig, inputsWithNoFields))
        nexusSchema.push(updateMany(model.name, mutationOutputTypes, updateConfig, inputsWithNoFields))
      }

      if (!(createConfig.disabled || updateConfig.disabled)) {
        nexusSchema.push(upsertOne(model.name, mutationOutputTypes, modelConfig, inputsWithNoFields))
      }

      const deleteConfig = modelConfig?.delete || {}
      if (!deleteConfig.disabled) {
        nexusSchema.push(deleteOne(model.name, mutationOutputTypes, inputsWithNoFields))
        nexusSchema.push(deleteMany(model.name, mutationOutputTypes, inputsWithNoFields))
      }
    }
  })

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

  const config = apiConfig[modelName as keyof ApiConfig]

  const isCreateInput = input.name.toLowerCase().includes('create')
  const removedCreateFields = config?.create?.removedFields?.map((rf) => {
    if (typeof rf === 'string') { return rf } else {
      return rf.fieldName
    }
  }) || []

  const isUpdateInput = input.name.toLowerCase().includes('update')
  const removedUpdateFields = config?.update?.removedFields?.map((rf) => {
    if (typeof rf === 'string') { return rf } else {
      return rf.fieldName
    }
  }) || []

  const isReadInput = !(isCreateInput || isUpdateInput)
  const removedReadFields = config?.read?.removedFields || []

  let fields = input.fields
  if (isCreateInput) {
    fields = fields.filter(field => {
      return !(removedCreateFields.includes(field.name))
    })
  }

  if (isUpdateInput) {
    fields = fields.filter(field => {
      return !(removedUpdateFields.includes(field.name))
    })
  }

  if (isReadInput) {
    fields = fields.filter(field => {
      return !(removedReadFields.includes(field.name))
    })
  }
  return fields
}
