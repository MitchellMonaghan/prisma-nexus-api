import fs from 'fs'
import { join } from 'path'
import { DMMF } from '@prisma/generator-helper'
import { capitalize } from 'lodash'

import { writeFileSafely } from '../utils/writeFileSafely'

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
  const modelTypes = modelNames.map(m => `${m}?: ${m}ModelConfiguration`)

  const content =
`import { PubSubEngine } from 'graphql-subscriptions'

export type ApiConfig = {
  pubsub?: PubSubEngine
  data: {
    ${modelTypes.join('\n    ')}
  }
}`

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
    const otherModels = modelNames.filter(m => m !== modelName).map(m => `${m}ExistsOperator`)
    const otherModelExistsOperators = otherModels.join('|')
    const logicOperators = ['AndOperator', 'OrOperator', 'NotOperator']
      .map(o => `${modelName}${o}`)
      .join('|')
    const modelPropertySelector = `${modelName}PropertySelector`
    const fullAccessRuleType = `(${logicOperators}|${otherModelExistsOperators}|${modelPropertySelector})[]`

    content += (i === 0 ? '' : '\n') + `
export type ${modelName}ModelCreateConfiguration = {
    disableAll?: boolean
    disableCreate?: boolean
    disableUpsert?: boolean
    removedFields?: ${modelName}CreateFields[]
    beforeCreateOne?: BeforeOperationMiddleware
    beforeUpsertOne?: BeforeOperationMiddleware
    afterCreateOne?: AfterOperationMiddleware
    afterUpsertOne?: AfterOperationMiddleware
    // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelReadConfiguration = {
    disableAll?: boolean
    disableAggregate?: boolean
    disableFindCount?: boolean
    disableFindFirst?: boolean
    disableFindMany?: boolean
    disableFindUnique?: boolean
    removedFields?: ${modelName}Fields[]
    beforeAggregate?: BeforeOperationMiddleware
    beforeFindCount?: BeforeOperationMiddleware
    beforeFindFirst?: BeforeOperationMiddleware
    beforeFindMany?: BeforeOperationMiddleware
    beforeFindUnique?: BeforeOperationMiddleware
    afterAggregate?: AfterOperationMiddleware
    afterFindCount?: AfterOperationMiddleware
    afterFindFirst?: AfterOperationMiddleware
    afterFindMany?: AfterOperationMiddleware
    afterFindUnique?: AfterOperationMiddleware
    // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    disableUpsert?: boolean
    removedFields?: ${modelName}UpdateFields[]
    beforeUpdateOne?: BeforeOperationMiddleware
    beforeUpdateMany?: BeforeOperationMiddleware
    beforeUpsertOne?: BeforeOperationMiddleware
    afterUpdateOne?: AfterOperationMiddleware
    afterUpdateMany?: AfterOperationMiddleware
    afterUpsertOne?: AfterOperationMiddleware
    // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelDeleteConfiguration = {
  disableAll?: boolean
  disableDeleteOne?: boolean
  disableDeleteMany?: boolean
  beforeDeleteOne?: BeforeOperationMiddleware
  beforeDeleteMany?: BeforeOperationMiddleware
  afterDeleteOne?: AfterOperationMiddleware
  afterDeleteMany?: AfterOperationMiddleware
  // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelConfiguration = {
  create?: ${modelName}ModelCreateConfiguration,
  read?: ${modelName}ModelReadConfiguration,
  update?: ${modelName}ModelUpdateConfiguration,
  delete?: ${modelName}ModelDeleteConfiguration
}`
  }

  return content
}

export const genApiConfigTypes = async (datamodel: DMMF.Datamodel) => {
  const modelUniqFields = datamodel.models.map(model => {
    const uniqFields = model.fields.filter(f => f.isId || f.isUnique).map(f => f.name)
    return `ModelUniqFields["${model.name}"] = "${uniqFields.join(',')}";`
  })

  const apiConfigJSPath = join(__dirname, '../_types/apiConfig.js')
  const apiConfigJSContent =
`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUniqFields = void 0;
var ModelUniqFields;
(function (ModelUniqFields) {
    ${modelUniqFields.join('\n    ')}
})(ModelUniqFields = exports.ModelUniqFields || (exports.ModelUniqFields = {}));
//# sourceMappingURL=apiConfig.js.map`
  await writeFileSafely(apiConfigJSPath, apiConfigJSContent)

  const operationMiddlewareTypePath = join(__dirname, '../../src/_types/operationMiddleware.ts')
  const operationMiddlewareType = fs.readFileSync(operationMiddlewareTypePath, 'utf8')

  let contents = ''
  contents += operationMiddlewareType
  contents += '\n' + genFieldTypes(datamodel.models)
  contents += '\n' + genModelConfigTypes(datamodel.models)
  contents += '\n\n' + genApiConfigType(datamodel.models)
  contents += '\n'

  return contents
}
