import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../getNexusArgs'
import { ApiConfig } from '../../_types/apiConfig'

export interface CreateAndNotifyOptions {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  createEvent?: string
}

export const createAndNotify = async (options:CreateAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    createEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const result = await prismaModel.create({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      ...uniqFieldSelect
    }
  })

  pubsub?.publish(createEvent || `${modelName}_CREATED`, result)

  return result
}

export const createOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const modelConfig = apiConfig.data[modelName] || {}
  const createConfig = modelConfig.create || {}
  const mutationName = `createOne${modelName}`
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

      if (createConfig.createOneOverride) {
        return createConfig.createOneOverride(prismaParams, ctx)
      }

      return createAndNotify({
        modelName,
        prismaParams,
        apiConfig
      })
    }
  })
}
