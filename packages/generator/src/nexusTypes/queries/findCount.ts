import { DMMF } from '@prisma/generator-helper'
import { queryField, nonNull } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig } from '../../_types/apiConfig'

export const findCount = (
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

  return queryField(`${queryName}Count`, {
    type: nonNull('Int'),
    args,
    resolve (_parent, args, ctx) {
      const { prisma, select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      if (allReadConfig.findCountOverride) {
        return allReadConfig.findCountOverride(modelName, prismaParams, ctx)
      } else if (readConfig.findCountOverride) {
        return readConfig.findCountOverride(modelName, prismaParams, ctx)
      }

      return prisma[modelName].count(prismaParams)
    }
  })
}
