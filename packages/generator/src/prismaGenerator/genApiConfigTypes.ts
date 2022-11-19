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

const genFieldTypes = (models: DMMF.Model[]) => {
  let content = ''
  for (let i = 0; i < models.length; i++) {
    const model = models[i]
    const modelName = model.name
    // const requiredFieldsTypeName = `${modelName}RequiredFields`
    const optionalFieldsTypeName = `${modelName}OptionalFields`
    const modelFieldsTypes = []

    content += (i === 0 ? '' : '\n\n')

    // Required Fields
    const requiredFields = model.fields.filter(f => f.isRequired)
    if (requiredFields.length > 0) {
      // const fieldStringNames = requiredFields.map(rf => `'${rf.name}'`)
      // content += `export type ${requiredFieldsTypeName} = ${fieldStringNames.join(' | ')}`
      // content += '\n'
      // modelFieldsTypes.push(requiredFieldsTypeName)

      for (let j = 0; j < requiredFields.length; j++) {
        const field = requiredFields[j]
        const type = getTypeScriptTypeFromPrismaType(field.type)
        const fieldResolverName = `${model.name}${capitalize(field.name)}FieldResolver`

        content +=
`export type ${fieldResolverName} = {
  fieldName: '${field.name}',
  resolver: (root: any, args: any, ctx: any, info: any) => Promise<${type}>
}`
        content += '\n'
        modelFieldsTypes.push(fieldResolverName)
      }
    }

    // Optional Fields
    const optionalFields = model.fields.filter(f => !f.isRequired)
    if (optionalFields.length > 0) {
      const fieldStringNames = optionalFields.map(of => `'${of.name}'`)
      content += `export type ${optionalFieldsTypeName} = ${fieldStringNames.join(' | ')}`
      content += '\n'
      modelFieldsTypes.push(optionalFieldsTypeName)

      for (let j = 0; j < optionalFields.length; j++) {
        const field = optionalFields[j]
        const type = getTypeScriptTypeFromPrismaType(field.type)
        const fieldResolverName = `${model.name}${capitalize(field.name)}FieldResolver`

        content +=
`export type ${fieldResolverName} = {
  fieldName: '${field.name}',
  resolver?: (root: any, args: any, ctx: any, info: any) => Promise<${type}|undefined>
}`
        content += '\n'
        modelFieldsTypes.push(fieldResolverName)
      }
    }

    content += `export type ${modelName}Fields = ${modelFieldsTypes.join(' | ')}`
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
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelReadConfiguration = {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
}

export type ${modelName}ModelUpdateConfiguration = {
    disabled?: boolean
    removedFields?: ${modelName}Fields[]
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
