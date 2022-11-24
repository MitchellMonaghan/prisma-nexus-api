import { DMMF } from '@prisma/generator-helper'
import { queryField } from 'nexus'

import { getNexusOperationArgs } from '../utils'
import { ApiConfig } from '../../_types/apiConfig'

export const findUnique = (
  modelName: string,
  queryOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
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
      const modelConfig = apiConfig.data[modelName] || {}
      const readConfig = modelConfig.read || {}

      if (readConfig.findUniqueOverride) {
        return readConfig.findUniqueOverride(modelName, prismaParams, ctx)
      }

      return prisma[modelName].findUnique(prismaParams)
    }
  })
}
