import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull, list } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const findMany = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  inputsWithNoFields:string[]
) => {
  const queryName = `findMany${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(queryName, {
    type: nonNull(list(nonNull(modelName))),
    args,
    resolve (_parent, args, { prisma, select }) {
      return prisma[modelName].findMany({
        ...args,
        ...select
      })
    }
  })
}
