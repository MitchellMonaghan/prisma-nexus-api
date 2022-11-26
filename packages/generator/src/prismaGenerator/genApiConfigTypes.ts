import { join } from 'path'
import { DMMF } from '@prisma/generator-helper'

import { writeFileSafely } from '../utils/writeFileSafely'

const genApiConfigType = (models: DMMF.Model[]) => {
  const modelNames = models.map(m => m.name)
  const modelTypes = modelNames.map(m => `${m}?: ${m}ModelConfiguration`)

  const content =
`import { PubSubEngine } from 'graphql-subscriptions'

export type ApiConfig = {
  prisma: PrismaClient
  pubsub?: PubSubEngine
  data: {
    all: ModelConfiguration
    ${modelTypes.join('\n    ')}
  }
}`

  return content
}

const genFieldTypes = (models: DMMF.Model[]) => {
  let content = ''
  for (let i = 0; i < models.length; i++) {
    const model = models[i]
    const modelName = model.name

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
    }

    // Optional Fields
    const optionalFields = model.fields.filter(f => !f.isRequired)
    if (optionalFields.length > 0) {
      const fieldStringNames = optionalFields.map(of => `'${of.name}'`)
      content += `\nexport type ${optionalFieldsTypeName} = ${fieldStringNames.join(' | ')}\n`
      modelFieldsTypes.push(optionalFieldsTypeName)
    }

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
    removedFields?: ${modelName}Fields[]
    createOneOverride?: OperationOverride<${modelName}>
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
    aggregateOverride?: OperationOverride<Get${modelName}AggregateType>
    findCountOverride?: OperationOverride<number>
    findFirstOverride?: OperationOverride<${modelName}|null>
    findManyOverride?: OperationOverride<${modelName}[]>
    findUniqueOverride?: OperationOverride<${modelName}|null>
    // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    removedFields?: ${modelName}Fields[]
    updateOneOverride?: OperationOverride<${modelName}>
    updateManyOverride?: OperationOverride<BatchPayload>
    // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelUpsertConfiguration = {
  disableAll?: boolean
  upsertOneOverride?: OperationOverride<${modelName}>
}

export type ${modelName}ModelDeleteConfiguration = {
  disableAll?: boolean
  disableDeleteOne?: boolean
  disableDeleteMany?: boolean
  deleteOneOverride?: OperationOverride<${modelName}>
  deleteManyOverride?: OperationOverride<BatchPayload>
  // access?: ${fullAccessRuleType}
}

export type ${modelName}ModelConfiguration = {
  removeFromSchema?: boolean
  disableAllOperations?: boolean
  create?: ${modelName}ModelCreateConfiguration,
  read?: ${modelName}ModelReadConfiguration,
  update?: ${modelName}ModelUpdateConfiguration,
  upsert?: ${modelName}ModelUpsertConfiguration,
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

  let contents = genFieldTypes(datamodel.models)
  contents += '\n' + genModelConfigTypes(datamodel.models)
  contents += '\n\n' + genApiConfigType(datamodel.models)
  contents += '\n'

  return contents
}
