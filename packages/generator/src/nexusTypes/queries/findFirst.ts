import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const findFirst = (modelName: string, queryOutputTypes?: DMMF.OutputType) => {
  const queryName = `findFirst${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes)

  return queryField(queryName, {
    type: modelName,
    args,
    resolve (_parent, args, { prisma, select }) {
      return prisma[modelName].findFirst({
        ...args,
        ...select
      })
    }
  })
}
