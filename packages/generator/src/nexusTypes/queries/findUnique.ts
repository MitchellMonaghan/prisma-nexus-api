import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export const findUnique = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allReadConfig = allConfig?.read || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const readConfig = modelConfig.read || {}
  const queryName = `findUnique${modelName}`
  const args = getNexusOperationArgs(queryName, queryOutputTypes, inputsWithNoFields)

  return queryField(queryName, {
    type: modelName,
    args,
    resolve (_parent, args, ctx) {
      const { prisma, select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      const overrideOptions:OperationOverrideOptions<any> = {
        modelName,
        prismaOperation: 'findUnique',
        prismaParams,
        ctx
      }

      if (readConfig.findUniqueOverride) {
        return readConfig.findUniqueOverride(overrideOptions)
      } else if (allReadConfig.findUniqueOverride) {
        return allReadConfig.findUniqueOverride(overrideOptions)
      }

      return prisma[modelName].findUnique(prismaParams)
    }
  })
}
