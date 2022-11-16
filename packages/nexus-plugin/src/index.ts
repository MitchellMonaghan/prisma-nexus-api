import { getInputType, hasEmptyTypeFields, PrismaSelect } from '@paljs/plugins'
import { enumType, inputObjectType, objectType, plugin } from 'nexus'
import { NexusAcceptedTypeDef } from 'nexus/dist/builder'
import { DMMF } from '@prisma/generator-helper'
import { Settings } from './settings'
import { getScalars } from './defaultScalar'

import { ApiConfig } from './_types/apiConfig'
import { maxBy } from 'lodash'

export { Settings }

const getDmmfs = (settings?: Settings) => {
  let dmmfs: DMMF.Document[] | undefined = settings?.dmmf
  if (!dmmfs) {
    const { Prisma } = require('@prisma/client')
    dmmfs = [Prisma.dmmf]
  }

  return dmmfs
}

// TODO: Should add type generation to this plugin
// Check if the type is already part of schema before adding
// User can use extendType for adding computed props
// User can use apiConfig for removing fields
// There's no reason to have the types generated

// I need to generate the nexus typegen for autocompletion
export const paljs = (settings: Settings) => plugin({
  name: 'paljs',
  description:
      'paljs plugin to add Prisma select to your resolver and all models input types',
  onInstall (builder) {
    const dmmfs = getDmmfs(settings)

    // Base types
    const nexusSchemaInputs: NexusAcceptedTypeDef[] = [
      objectType({
        name: 'BatchPayload',
        definition (t) {
          t.nonNull.int('count')
        }
      }),
      ...getScalars(settings?.excludeScalar)
    ]

    const allTypes: string[] = []

    for (const dmmf of dmmfs) {
      const data = dmmf.schema
      if (!data) { continue }

      const modelNames = dmmf.datamodel.models.map(m => m.name)

      // Models
      const models = dmmf.datamodel.models
      models.forEach((model) => {
        if (allTypes.includes(model.name)) { return }

        const nexusModel = objectType({
          nonNullDefaults: {
            output: true,
            input: false
          },
          name: model.name,
          description: model.documentation,
          definition (t) {
            model.fields.filter((field) => !settings?.excludeFields?.includes(field.name))
              .forEach((field) => {
                const fieldConfig: {
                  [key: string]: any;
                  type: string;
                } = {
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

        nexusSchemaInputs.push(nexusModel)
        allTypes.push(model.name)
      })

      // Enums
      const enums = [...data.enumTypes.prisma]
      if (data.enumTypes.model) enums.push(...data.enumTypes.model)
      enums.forEach((item) => {
        if (!allTypes.includes(item.name)) {
          nexusSchemaInputs.push(
            enumType({
              name: item.name,
              members: item.values
            })
          )
          allTypes.push(item.name)
        }
      })

      // Input types
      const inputObjectTypes = [...data.inputObjectTypes.prisma]
      if (data.inputObjectTypes.model) { inputObjectTypes.push(...data.inputObjectTypes.model) }
      inputObjectTypes.forEach((input) => {
        input.fields = filterInputsWithApiConfig(settings.apiConfig, input, modelNames)
        const inputFields =
            typeof settings?.filterInputs === 'function'
              ? settings.filterInputs(input)
              : input.fields

        if (inputFields.length > 0) {
          if (!allTypes.includes(input.name)) {
            nexusSchemaInputs.push(
              inputObjectType({
                nonNullDefaults: {
                  input: false
                },
                name: input.name,
                definition (t) {
                  inputFields
                    .filter(
                      (field) =>
                        !settings?.excludeFields?.includes(field.name)
                    )
                    .forEach((field) => {
                      const inputType = getInputType(field, settings)
                      const hasEmptyType =
                          inputType.location === 'inputObjectTypes' &&
                          hasEmptyTypeFields(inputType.type as string, {
                            dmmf
                          })
                      if (!hasEmptyType) {
                        const fieldConfig: {
                            [key: string]: any;
                            type: string;
                          } = {
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
            )
            allTypes.push(input.name)
          }
        }
      })

      // Output types
      data.outputObjectTypes.prisma
        .filter(
          (type) =>
            type.name.includes('Aggregate') ||
              type.name.endsWith('CountOutputType')
        )
        .forEach((type) => {
          if (!allTypes.includes(type.name)) {
            nexusSchemaInputs.push(
              objectType({
                nonNullDefaults: {
                  output: true
                },
                name: type.name,
                definition (t) {
                  type.fields
                    .filter(
                      (field) =>
                        !settings?.excludeFields?.includes(field.name)
                    )
                    .forEach((field) => {
                      const fieldConfig: {
                          [key: string]: any;
                          type: string;
                        } = {
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
            )
            allTypes.push(type.name)
          }
        })
    }

    for (const type of nexusSchemaInputs) {
      builder.addType(type)
    }
  },
  onCreateFieldResolver () {
    return async (root, args, ctx, info: any, next) => {
      ctx.select = new PrismaSelect(info, {
        dmmf: settings?.dmmf,
        ...settings?.prismaSelectOptions
      }).value
      return await next(root, args, ctx, info)
    }
  }
})

const filterInputsWithApiConfig = (apiConfig: ApiConfig, input: DMMF.InputType, modelNames: string[]) => {
  const matchingModelNames = modelNames.filter(mn => input.name.startsWith(mn))
  const model = maxBy(matchingModelNames, (mn) => mn.length)

  if (!model) {
    return input.fields
  }

  const config = apiConfig[model as keyof ApiConfig]

  const isCreateInput = input.name.toLowerCase().includes('create')
  const removedCreateFields = config?.create?.removedFields || []

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
