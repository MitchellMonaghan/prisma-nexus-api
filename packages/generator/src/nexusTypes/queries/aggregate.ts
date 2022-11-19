import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const aggregate = (modelName: string, queryOutputTypes?: DMMF.OutputType) => {
  const queryName = `aggregate${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes)

  return queryField(queryName, {
    type: `Aggregate${modelName}`,
    args,
    resolve (_parent, args, { prisma, select }) {
      return prisma[modelName].aggregate({ ...args, ...select }) as any
    }
  })
}
