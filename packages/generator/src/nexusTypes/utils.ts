import { DMMF } from '@prisma/generator-helper'
import { nonNull, list } from 'nexus'

import {
  AndOperator,
  OrOperator,
  NotOperator,
  ExistsOperator,
  PropertySelector
} from '../_types/genericPropertySelector'

import { ApiConfig, ModelUniqFields } from '../_types/apiConfig'

const getType = (arg: DMMF.SchemaArg) => {
  let type = `${arg.inputTypes[0].type}` as any

  if (arg.inputTypes[0].isList) {
    type = list(`${type}`)
  }

  if (arg.isRequired) {
    type = nonNull(type)
  }

  return type
}

export const getNexusArgs = (args: DMMF.SchemaArg[], inputsWithNoFields?:string[]) => {
  const nexusArgs = {} as Record<string, any>
  args.forEach((arg) => {
    const argIsEmpty = inputsWithNoFields && inputsWithNoFields.includes(arg.name)
    const typeIsEmpty = inputsWithNoFields && inputsWithNoFields.includes(arg.inputTypes[0].type as string)
    if (argIsEmpty || typeIsEmpty) {
      return
    }

    nexusArgs[arg.name] = getType(arg)
  })

  return nexusArgs
}

export const getNexusOperationArgs = (operationName: string, outputTypes: DMMF.OutputType, inputsWithNoFields?:string[]) => {
  const mutationPrismaType = outputTypes.fields.find(f => f.name === operationName)
  return getNexusArgs(mutationPrismaType?.args || [], inputsWithNoFields)
}

export const getModelUniqFieldSelect = (modelName: string) => {
  const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = true
    return accumulator
  }, {} as Record<string, boolean>)

  return uniqFieldSelect
}

export const getModelRemovedFields = (modelName: string, operation:'create'|'read'|'update', apiConfig:ApiConfig) => {
  const allConfiguration = apiConfig.data.all || {}
  const modelConfiguration = apiConfig.data[modelName as (keyof ApiConfig)] || {}

  const allOperationConfiguration = allConfiguration[operation] || {}
  const modelOperationConfiguration = modelConfiguration[operation] || {}

  const excludedAllFields = allOperationConfiguration?.removedFields || []
  const excludedModelFields = (modelConfiguration?.removedFields || []).concat(modelOperationConfiguration?.removedFields || [])
  const excludedFields = excludedAllFields.concat(excludedModelFields)

  return excludedFields
}

export const runAccessConfiguration = async (access?: (AndOperator | OrOperator | NotOperator | ExistsOperator | PropertySelector)[] | undefined) => {
  if (!access) { return true }

  let canAccess = true
  for (let i = 0; i < access.length; i++) {
    const accessObject = access[i]
    canAccess = !!accessObject && canAccess
  }

  return canAccess
}

const resolveAndOperator = () => {
  return true
}

const resolveOrOperator = () => {
  return true
}

const resolveNotOperator = () => {
  return true
}

const resolvePropertySelector = () => {
  return true
}

const resolveExistsOperator = () => {
  return true
}
