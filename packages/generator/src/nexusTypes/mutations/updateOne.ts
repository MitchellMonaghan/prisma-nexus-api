import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../getNexusArgs'
import { ApiConfig } from '../../_types/apiConfig'

export interface UpdateAndNotifyOptions {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  updateEvent?: string
}

export const updateAndNotify = async (options:UpdateAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    updateEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const result = await prismaModel.update({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      ...uniqFieldSelect
    }
  })

  pubsub?.publish(updateEvent || `${modelName}_UPDATED`, result)

  return result
}

export const updateOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const modelConfig = apiConfig.data[modelName] || {}
  const updateConfig = modelConfig.update || {}
  const mutationName = `updateOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (_parent, args, ctx) => {
      if (!args.data) { args.data = {} }
      const { select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      if (updateConfig.updateOneOverride) {
        return updateConfig.updateOneOverride(prismaParams, ctx)
      }

      return updateAndNotify({
        modelName,
        prismaParams,
        apiConfig
      })
    }
  })
}
