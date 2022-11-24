import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull, list } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export const findMany = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allReadConfig = allConfig?.read || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const readConfig = modelConfig.read || {}
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

      const overrideOptions:OperationOverrideOptions<any, any> = {
        modelName,
        prismaOperation: 'findMany',
        prismaParams,
        ctx,
        apiConfig
      }

      if (readConfig.findManyOverride) {
        return readConfig.findManyOverride(overrideOptions)
      } else if (allReadConfig.findManyOverride) {
        return allReadConfig.findManyOverride(overrideOptions)
      }

      return prisma[modelName].findMany(prismaParams)
    }
  })
}
