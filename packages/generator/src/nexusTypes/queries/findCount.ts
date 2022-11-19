import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const findCount = (modelName: string, queryOutputTypes: DMMF.OutputType) => {
  const queryName = `findMany${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes)

  return queryField(`${queryName}Count`, {
    type: nonNull('Int'),
    args,
    resolve (_parent, args, { prisma }) {
      return prisma[modelName].count(args as any)
    }
  })
}
