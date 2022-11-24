import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export const aggregate = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allReadConfig = allConfig?.read || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const readConfig = modelConfig.read || {}
  const queryName = `aggregate${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(queryName, {
    type: `Aggregate${modelName}`,
    args,
    resolve (_parent, args, ctx) {
      const { prisma, select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      const overrideOptions:OperationOverrideOptions<any> = {
        modelName,
        prismaOperation: 'aggregate',
        prismaParams,
        ctx
      }

      if (readConfig.aggregateOverride) {
        return readConfig.aggregateOverride(overrideOptions)
      } else if (allReadConfig.aggregateOverride) {
        return allReadConfig.aggregateOverride(overrideOptions)
      }

      return prisma[modelName].aggregate(prismaParams)
    }
  })
}
