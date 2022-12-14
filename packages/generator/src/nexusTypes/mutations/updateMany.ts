import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export interface UpdateManyAndNotifyOptions extends OperationOverrideOptions<any, any> {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  updateEvent?: string
}

export const updateManyAndNotify = async (options:UpdateManyAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    updateEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const result = await prismaModel.updateMany({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      uniqFieldSelect
    }
  })
  const updatedItems = await prismaModel.findMany({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      uniqFieldSelect
    }
  })

  pubsub?.publish(updateEvent || `${modelName}_UPDATED`, updatedItems)

  return result
}

export const updateMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allUpdateConfig = allConfig?.update || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const updateConfig = modelConfig.update || {}
  const mutationName = `updateMany${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull('BatchPayload'),
    args,
    resolve: async (_parent, args, ctx) => {
      const { select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      const overrideOptions:OperationOverrideOptions<any, any> = {
        modelName,
        prismaOperation: 'updateMany',
        prismaParams,
        ctx,
        apiConfig
      }

      if (updateConfig.updateManyOverride) {
        return updateConfig.updateManyOverride(overrideOptions)
      } else if (allUpdateConfig.updateManyOverride) {
        return allUpdateConfig.updateManyOverride(overrideOptions)
      }

      return updateManyAndNotify(overrideOptions)
    }
  })
}
