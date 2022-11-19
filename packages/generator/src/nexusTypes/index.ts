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
const hasEmptyTypeFields = (type: string, options?: OptionsType) => {
  let schema = options?.dmmf?.schema
  if (!schema) {
    const { Prisma } = require('@prisma/client')
    schema = Prisma.dmmf?.schema
  }
  testedTypes.push(type)
  const inputObjectTypes = schema ? [...schema?.inputObjectTypes.prisma] : []
  if (schema?.inputObjectTypes.model) { inputObjectTypes.push(...schema.inputObjectTypes.model) }

  const inputType = inputObjectTypes.find((item) => item.name === type)
  if (inputType) {
    if (inputType.fields.length === 0) return true
    for (const field of inputType.fields) {
      const fieldType = getInputType(field, options)
      if (
        fieldType.type !== type &&
        fieldType.location === 'inputObjectTypes' &&
        !testedTypes.includes(fieldType.type as string)
      ) {
        const state = hasEmptyTypeFields(fieldType.type as string, options)
        if (state) return true
      }
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
  const nexusSchema: NexusAcceptedTypeDef[] = []

  const allTypes: string[] = []

  const data = apiDmmf.schema
  if (!data) {
    return nexusSchema
  }

  const modelNames = apiDmmf.datamodel.models.map(m => m.name)
  const queryOutputTypes = data.outputObjectTypes.prisma.find(t => t.name === 'Query')
  const mutationOutputTypes = data.outputObjectTypes.prisma.find(t => t.name === 'Mutation')

  // Models
  const models = apiDmmf.datamodel.models
  models.forEach((model) => {
    if (allTypes.includes(model.name)) { return }

    const modelConfig = settings.apiConfig[model.name]
    const nexusModel = objectType({
      nonNullDefaults: {
        output: true,
        input: false
      },
      name: model.name,
      description: model.documentation,
      definition (t) {
        const filteredFields = model.fields.filter((field) => {
          const excludeFields = modelConfig?.read?.removedFields || []
          return !excludeFields.includes(field.name)
        })

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
      nexusSchema.push(aggregate(model.name, queryOutputTypes))
      nexusSchema.push(findCount(model.name, queryOutputTypes))
      nexusSchema.push(findFirst(model.name, queryOutputTypes))
      nexusSchema.push(findMany(model.name, queryOutputTypes))
      nexusSchema.push(findUnique(model.name, queryOutputTypes))
    }

    // Mutations
    if (mutationOutputTypes) {
      nexusSchema.push(createOne(model.name, mutationOutputTypes, modelConfig?.create || {}))
      nexusSchema.push(upsertOne(model.name, mutationOutputTypes, modelConfig?.create || {}))
      nexusSchema.push(updateOne(model.name, mutationOutputTypes))
      nexusSchema.push(updateMany(model.name, mutationOutputTypes))
      nexusSchema.push(deleteOne(model.name, mutationOutputTypes))
      nexusSchema.push(deleteMany(model.name, mutationOutputTypes))
    }
  })

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
  const inputObjectTypes = [...data.inputObjectTypes.prisma]
  if (data.inputObjectTypes.model) { inputObjectTypes.push(...data.inputObjectTypes.model) }
  inputObjectTypes.forEach((input) => {
    const inputFields = filterInputsWithApiConfig(settings.apiConfig, input, modelNames)

    if (inputFields.length === 0) { return }

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
              hasEmptyTypeFields(inputType.type as string, {
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
  data.outputObjectTypes.prisma
    .filter((type) => type.name.includes('Aggregate') || type.name.endsWith('CountOutputType'))
    .forEach((type) => {
      if (allTypes.includes(type.name)) { return }

      const outputType = objectType({
        nonNullDefaults: {
          output: true
        },
        name: type.name,
        definition (t) {
          type.fields.forEach((field) => {
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

  return nexusSchema
}

const filterInputsWithApiConfig = (apiConfig: ApiConfig, input: DMMF.InputType, modelNames: string[]) => {
  const matchingModelNames = modelNames.filter(mn => input.name.startsWith(mn))
  const model = maxBy(matchingModelNames, (mn) => mn.length)

  if (!model) {
    return input.fields
  }

  const config = apiConfig[model as keyof ApiConfig]

  const isCreateInput = input.name.toLowerCase().includes('create')
  const removedCreateFields = config?.create?.removedFields?.map((rf) => {
    if (typeof rf === 'string') { return rf } else {
      return rf.fieldName
    }
  }) || []

  const isUpdateInput = input.name.toLowerCase().includes('update')
  const removedUpdateFields = config?.update?.removedFields || []

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
