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

    content += `\nexport type ${modelName}AccessRule = ${accessRuleTypes.join('|')}`
  }

  return content
}

export const genApiConfigAccessRules = async (datamodel: DMMF.Datamodel) => {
  const genericAccessRuleTypesPath = join(__dirname, '../../src/_types/genericAccessRule.ts')
  const genericAccessRuleTypes = fs.readFileSync(genericAccessRuleTypesPath, 'utf8')

  let contents = ''
  contents += genericAccessRuleTypes
  contents += '\n' + genFieldTypes(datamodel.models)
  contents += '\n'

  return contents
}
