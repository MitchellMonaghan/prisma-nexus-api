import fs from 'fs'
import { join } from 'path'
import { DMMF } from '@prisma/generator-helper'

import { writeFileSafely } from '../utils/writeFileSafely'
import { capitalize } from 'lodash'

const getTypeScriptTypeFromPrismaType = (prismaType:string) => {
  if (prismaType === 'Int' || prismaType === 'Float') {
    return 'number'
  } else if (prismaType === 'Boolean') {
    return 'boolean'
  } else if (prismaType === 'ID' || prismaType === 'String') {
    return 'string'
  }

  throw new Error(`Unsupported prisma type ${prismaType}`)
}

const genApiConfigType = (models: DMMF.Model[]) => {
  const modelNames = models.map(m => m.name)

  let content = 'export type ApiConfig = {'

  for (let i = 0; i < modelNames.length; i++) {
    const modelName = modelNames[i]
    content += `\n    ${modelName}?: ${modelName}ModelConfiguration`
  }

  content += '\n}'

  return content
}

const getRequiredFieldResolverName = (model: DMMF.Model, field: DMMF.Field) => `${model.name}${capitalize(field.name)}RequiredFieldResolver`
const getRequiredFieldResolver = (model: DMMF.Model, field: DMMF.Field) => {
  const type = getTypeScriptTypeFromPrismaType(field.type)
  const requiredFieldResolverName = getRequiredFieldResolverName(model, field)

  return `export type ${requiredFieldResolverName} = {
  fieldName: '${field.name}',
  resolver: (root: any, args: any, ctx: any, info: any) => Promise<${type}>
}\n`
}

const getOptionalFieldResolverName = (model: DMMF.Model, field: DMMF.Field) => `${model.name}${capitalize(field.name)}OptionalFieldResolver`
const getOptionalFieldResolver = (model: DMMF.Model, field: DMMF.Field) => {
  const type = getTypeScriptTypeFromPrismaType(field.type)
  const optionalFieldResolverName = getOptionalFieldResolverName(model, field)

  return `export type ${optionalFieldResolverName} = {
  fieldName: '${field.name}',
  resolver: (root: any, args: any, ctx: any, info: any) => Promise<${type}|void>
}\n`
}

const genFieldTypes = (models: DMMF.Model[]) => {
  let content = ''
  for (let i = 0; i < models.length; i++) {
    const model = models[i]
    const modelName = model.name
    const createFieldsTypeName = `${modelName}CreateFields`
    const createFieldsTypes = []
    const updateFieldsTypeName = `${modelName}UpdateFields`
    const updateFieldsTypes = []

    const requiredFieldsTypeName = `${modelName}RequiredFields`
    const optionalFieldsTypeName = `${modelName}OptionalFields`
    const modelFieldsTypes = []

    content += (i === 0 ? '' : '\n\n')

    // Required Fields
    const requiredFields = model.fields.filter(f => f.isRequired)
    if (requiredFields.length > 0) {
      const fieldStringNames = requiredFields.map(rf => `'${rf.name}'`)
      content += `export type ${requiredFieldsTypeName} = ${fieldStringNames.join(' | ')}`
      content += '\n'
      modelFieldsTypes.push(requiredFieldsTypeName)
      updateFieldsTypes.push(requiredFieldsTypeName)

      for (let j = 0; j < requiredFields.length; j++) {
        const field = requiredFields[j]

        content += getRequiredFieldResolver(model, field)
        createFieldsTypes.push(getRequiredFieldResolverName(model, field))

        content += getOptionalFieldResolver(model, field)
        updateFieldsTypes.push(getOptionalFieldResolverName(model, field))
      }
    }

    // Optional Fields
    const optionalFields = model.fields.filter(f => !f.isRequired)
    if (optionalFields.length > 0) {
      const fieldStringNames = optionalFields.map(of => `'${of.name}'`)
      content += `\nexport type ${optionalFieldsTypeName} = ${fieldStringNames.join(' | ')}\n`
      modelFieldsTypes.push(optionalFieldsTypeName)
      createFieldsTypes.push(optionalFieldsTypeName)
      updateFieldsTypes.push(optionalFieldsTypeName)

      for (let j = 0; j < optionalFields.length; j++) {
        const field = optionalFields[j]

        content += getOptionalFieldResolver(model, field)
        createFieldsTypes.push(getOptionalFieldResolverName(model, field))
        updateFieldsTypes.push(getOptionalFieldResolverName(model, field))
      }
    }

    content += `export type ${createFieldsTypeName} = ${createFieldsTypes.join(' | ')}`
    content += `\nexport type ${updateFieldsTypeName} = ${updateFieldsTypes.join(' | ')}`
    content += `\nexport type ${modelName}Fields = ${modelFieldsTypes.join(' | ')}`
  }

  return content
}

const genModelConfigTypes = (models: DMMF.Model[]) => {
  const modelNames = models.map(m => m.name)

  let content = ''
  for (let i = 0; i < modelNames.length; i++) {
    const modelName = modelNames[i]
    content += (i === 0 ? '' : '\n') + `
export type ${modelName}ModelCreateConfiguration = {
    disabled?: boolean
    removedFields?: ${modelName}CreateFields[]
}

export type ${modelName}ModelReadConfiguration = {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelUpdateConfiguration = {
    disabled?: boolean
    removedFields?: ${modelName}UpdateFields[]
}

export type ${modelName}ModelConfiguration = {
    create?: ${modelName}ModelCreateConfiguration,
    read?: ${modelName}ModelReadConfiguration,
    update?: ${modelName}ModelUpdateConfiguration,
    delete?: ModelDeleteConfiguration,
    access?: AccessRule[]
}`
  }

  return content
}

export const genApiConfigTypes = async (datamodel: DMMF.Datamodel) => {
  const accessRuleTypesPath = join(__dirname, '../../src/_types/accessRule.ts')
  const accessRuleTypes = fs.readFileSync(accessRuleTypesPath, 'utf8')

  const modelDeleteConfigurationTypesPath = join(__dirname, '../../src/_types/modelDeleteConfiguration.ts')
  const modelDeleteConfigurationTypes = fs.readFileSync(modelDeleteConfigurationTypesPath, 'utf8')

  let contents = ''
  contents += accessRuleTypes
  contents += '\n' + modelDeleteConfigurationTypes
  contents += '\n' + genFieldTypes(datamodel.models)
  contents += '\n' + genModelConfigTypes(datamodel.models)
  contents += '\n\n' + genApiConfigType(datamodel.models)
  contents += '\n'

  const pluginSettingsTypePath = join(__dirname, '../_types/apiConfig.d.ts')
  await writeFileSafely(pluginSettingsTypePath, contents)
}
