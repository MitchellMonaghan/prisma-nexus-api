import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../utils'

export const findCount = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  inputsWithNoFields:string[]
) => {
  const queryName = `findMany${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(`${queryName}Count`, {
    type: nonNull('Int'),
    args,
    resolve (_parent, args, { prisma }) {
      return prisma[modelName].count(args as any)
    }
  })
}
