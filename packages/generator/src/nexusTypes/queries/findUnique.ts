import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const findUnique = (modelName: string, queryOutputTypes: DMMF.OutputType) => {
  const queryName = `findUnique${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes)

  return queryField(queryName, {
    type: modelName,
    args,
    resolve (_parent, { where }, { prisma, select }) {
      return prisma[modelName].findUnique({
        where,
        ...select
      })
    }
  })
}
