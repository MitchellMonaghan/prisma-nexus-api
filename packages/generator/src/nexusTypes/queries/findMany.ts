import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull, list } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig } from '../../_types/apiConfig'

export const findMany = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const queryName = `findMany${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(queryName, {
    type: nonNull(list(nonNull(modelName))),
    args,
    resolve (_parent, args, ctx) {
      const { prisma, select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }
      const modelConfig = apiConfig.data[modelName] || {}
      const readConfig = modelConfig.read || {}

      if (readConfig.findManyOverride) {
        return readConfig.findManyOverride(modelName, prismaParams, ctx)
      }

      return prisma[modelName].findMany(prismaParams)
    }
  })
}
