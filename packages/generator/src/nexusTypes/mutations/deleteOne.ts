import { DMMF } from '@prisma/generator-helper'
import { mutationField } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../utils'
import { ApiConfig } from '../../_types/apiConfig'

export interface DeleteAndNotifyOptions {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  deleteEvent?: string
}

export const deleteAndNotify = async (options:DeleteAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    deleteEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const result = await prismaModel.delete({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      ...uniqFieldSelect
    }
  })

  pubsub?.publish(deleteEvent || `${modelName}_DELETED`, result)

  return result
}

export const deleteOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allDeleteConfig = allConfig?.delete || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const deleteConfig = modelConfig.delete || {}
  const mutationName = `deleteOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: modelName,
    args,
    resolve: async (_parent, args, ctx) => {
      const { select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      if (deleteConfig.deleteOneOverride) {
        return deleteConfig.deleteOneOverride(modelName, prismaParams, ctx)
      } else if (allDeleteConfig.deleteOneOverride) {
        return allDeleteConfig.deleteOneOverride(modelName, prismaParams, ctx)
      }

      return deleteAndNotify({
        modelName,
        prismaParams,
        apiConfig
      })
    }
  })
}
