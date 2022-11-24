import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export interface DeleteManyAndNotifyOptions extends OperationOverrideOptions<any, any> {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  deleteEvent?: string
}

export const deleteManyAndNotify = async (options:DeleteManyAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    deleteEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const itemsToBeDeleted = await prismaModel.findMany({
    ...prismaParams,
    select: uniqFieldSelect
  })
  const result = await prismaModel.deleteMany(prismaParams)

  pubsub?.publish(deleteEvent || `${modelName}_DELETED`, itemsToBeDeleted)

  return result
}

export const deleteMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allDeleteConfig = allConfig?.delete || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const deleteConfig = modelConfig.delete || {}
  const mutationName = `deleteMany${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull('BatchPayload'),
    args,
    resolve: async (_parent, args, ctx) => {
      const prismaParams = {
        ...args
      }

      const overrideOptions:OperationOverrideOptions<any, any> = {
        modelName,
        prismaOperation: 'deleteMany',
        prismaParams,
        ctx,
        apiConfig
      }

      if (deleteConfig.deleteManyOverride) {
        return deleteConfig.deleteManyOverride(overrideOptions)
      } else if (allDeleteConfig.deleteManyOverride) {
        return allDeleteConfig.deleteManyOverride(overrideOptions)
      }

      return deleteManyAndNotify(overrideOptions)
    }
  })
}
