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
      const modelConfig = apiConfig.data[modelName] || {}
      const readConfig = modelConfig.read || {}

      if (readConfig.findCountOverride) {
        return readConfig.findCountOverride(modelName, prismaParams, ctx)
      }

      return prisma[modelName].count(prismaParams)
    }
  })
}
