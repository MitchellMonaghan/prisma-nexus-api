import { DMMF } from '@prisma/generator-helper'
import { nonNull, list } from 'nexus'

import { FieldResolver } from '../_types/genericApiConfig'
import {
  AndOperator,
  OrOperator,
  NotOperator,
  ExistsOperator,
  PropertySelector
} from '../_types/genericPropertySelector'

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

export const getConfiguredFieldResolvers = async (
  parent:any,
  args:any,
  ctx:any,
  info:any,
  removedFields:(string | FieldResolver)[]
) => {
  const data = {} as Record<string, any>
  for (let i = 0; i < removedFields.length; i++) {
    const removedField = removedFields[i]
    const isString = typeof removedField === 'string'

    if (isString) { continue }

    data[removedField.fieldName] = await removedField.resolver(parent, args, ctx, info)
  }

  return data
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
