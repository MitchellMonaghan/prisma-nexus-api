import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'
import { getNexusOperationArgs } from '../utils'

export const aggregate = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  inputsWithNoFields:string[]
) => {
  const queryName = `aggregate${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(queryName, {
    type: `Aggregate${modelName}`,
    args,
    resolve (_parent, args, { prisma, select }) {
      return prisma[modelName].aggregate({ ...args, ...select }) as any
    }
  })
}
