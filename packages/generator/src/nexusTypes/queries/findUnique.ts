import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'
import { getNexusOperationArgs } from '../utils'

export const findUnique = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  inputsWithNoFields:string[]
) => {
  const queryName = `findUnique${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

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
