import fs from 'fs'
import { join } from 'path'
import { DMMF } from '@prisma/generator-helper'

const getStringFieldsTypeName = (modelName:string) => `${modelName}StringFields`
const getNumberFieldsTypeName = (modelName:string) => `${modelName}NumberFields`
const getBoleanFieldsTypeName = (modelName:string) => `${modelName}BooleanFields`
const getDateFieldsTypeName = (modelName:string) => `${modelName}DateTimeFields`

const genFieldTypes = (models: DMMF.Model[]) => {
  let content = ''
  for (let i = 0; i < models.length; i++) {
    const model = models[i]
    const modelName = model.name
    const otherModels = models.filter(m => m.name !== modelName).map(m => `${m.name}ExistsOperator`)
    const otherModelExistsOperators = otherModels.join('|')
    const logicOperators = ['AndOperator', 'OrOperator', 'NotOperator']
      .map(o => `${modelName}${o}`)
      .join('|')
    const modelPropertySelector = `${modelName}PropertySelector`
    const fullAccessRuleType = `(${logicOperators}|${otherModelExistsOperators}|${modelPropertySelector})[]`

    const accessRuleTypes = []
    content += (i === 0 ? '' : '\n\n')

    const stringFields = model.fields.filter((f) => f.type === 'String').map(f => `'${f.name}'`)
    if (stringFields.length > 0) {
      const fieldsTypeName = getStringFieldsTypeName(modelName)
      const accessRuleName = `${modelName}StringAccessRule`
      accessRuleTypes.push(accessRuleName)

      content += `export type ${fieldsTypeName} = ${stringFields.join('|')}`
      content +=
`\nexport type ${accessRuleName} = StringAccessRule & {
  property: ${fieldsTypeName}
}`
    }

    const numberFields = model.fields.filter((f) => f.type === 'Int' || f.type === 'Float' || f.type === 'BigInt' || f.type === 'Decimal').map(f => `'${f.name}'`)
    if (numberFields.length > 0) {
      const fieldsTypeName = getNumberFieldsTypeName(modelName)
      const accessRuleName = `${modelName}NumberAccessRule`
      accessRuleTypes.push(accessRuleName)

      content += `\nexport type ${fieldsTypeName} = ${numberFields.join('|')}`
      content +=
`\nexport type ${accessRuleName} = NumberAccessRule & {
  property: ${fieldsTypeName}
}`
    }

    const booleanFields = model.fields.filter((f) => f.type === 'Boolean').map(f => `'${f.name}'`)
    if (booleanFields.length > 0) {
      const fieldsTypeName = getBoleanFieldsTypeName(modelName)
      const accessRuleName = `${modelName}BooleanAccessRule`
      accessRuleTypes.push(accessRuleName)

      content += `\nexport type ${fieldsTypeName} = ${booleanFields.join('|')}`
      content +=
`\nexport type ${accessRuleName} = BooleanAccessRule & {
  property: ${fieldsTypeName}
}`
    }

    const dateTimeFields = model.fields.filter((f) => f.type === 'DateTime').map(f => `'${f.name}'`)
    if (dateTimeFields.length > 0) {
      const fieldsTypeName = getDateFieldsTypeName(modelName)
      const accessRuleName = `${modelName}DateAccessRule`
      accessRuleTypes.push(accessRuleName)

      content += `\nexport type ${fieldsTypeName} = ${dateTimeFields.join('|')}`
      content +=
`\nexport type ${accessRuleName} = DateAccessRule & {
  property: ${fieldsTypeName}
}`
    }

    content += `
// eslint-disable-next-line no-use-before-define
export type ${modelPropertySelector} = ${accessRuleTypes.join('|')}

export type ${modelName}AndOperator = {
  property: 'and'
  // eslint-disable-next-line no-use-before-define
  value: ${fullAccessRuleType}
}
export type ${modelName}OrOperator = {
  property: 'or'
  // eslint-disable-next-line no-use-before-define
  value: ${fullAccessRuleType}
}
export type ${modelName}NotOperator = {
  property: 'not'
  // eslint-disable-next-line no-use-before-define
  value: ${fullAccessRuleType}
}

export type ${modelName}ExistsOperator = {
  property: 'exists'
  table: '${modelName}'
  where: (${logicOperators}|${modelPropertySelector})[]
}`
  }

  return content
}

const getPismaTypes = (datamodel: DMMF.Datamodel) => {
  const models = datamodel.models
  const enums = datamodel.enums

  return `
import {
  PrismaClient,
  BatchPayload,
  ${models.map(m => `Get${m.name}AggregateType`).join(',\n  ')},
  ${models.concat(enums as any).map(m => `${m.name}`).join(',\n  ')}
} from '@prisma/client'
import { ModelConfiguration } from './genericApiConfig'

export type Models = ${models.map(m => `'${m.name}'`).join('|')}

export type OperationOverrideOptions<ParamsType, ContextType> = {
  modelName:string
  prismaOperation:string
  prismaParams: ParamsType
  ctx: ContextType
  // eslint-disable-next-line no-use-before-define
  apiConfig: ApiConfig
}
export type OperationOverride<T> = (options: OperationOverrideOptions<any, any>) => Promise<T>
`
}

export const genApiConfigAccessRules = async (datamodel: DMMF.Datamodel) => {
  const genericPropertySelectorTypePath = join(__dirname, '../../src/_types/genericPropertySelector.ts')
  const genericPropertySelectorType = fs.readFileSync(genericPropertySelectorTypePath, 'utf8')

  let contents = getPismaTypes(datamodel)
  contents += '\n' + genericPropertySelectorType
  contents += '\n' + genFieldTypes(datamodel.models)
  contents += '\n'

  return contents
}
