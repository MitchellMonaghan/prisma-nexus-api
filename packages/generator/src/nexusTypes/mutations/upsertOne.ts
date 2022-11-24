import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export interface UpsertAndNotifyOptions {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  createEvent?: string
  updateEvent?: string
}

export const upsertAndNotify = async (options: UpsertAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    createEvent,
    updateEvent
  } = options

  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)
  const count = await prismaModel.count({
    ...prismaParams
  })
  const itemExists = count > 0

  const result = await prismaModel.upsert({
    ...prismaParams,
    select: {
      ...prismaParams.select,
      ...uniqFieldSelect
    }
  })

  if (itemExists) {
    pubsub?.publish(createEvent || `${modelName}_UPDATED`, result)
  } else {
    pubsub?.publish(updateEvent || `${modelName}_CREATED`, result)
  }

  return result
}

export const upsertOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allUpsertConfig = allConfig?.upsert || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const upsertConfig = modelConfig.upsert || {}

  const mutationName = `upsertOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (_parent, args, ctx) => {
      if (!args.where) { args.where = {} }
      if (!args.create) { args.create = {} }
      if (!args.update) { args.update = {} }

      const { select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      const overrideOptions:OperationOverrideOptions<any> = {
        modelName,
        prismaOperation: 'upsert',
        prismaParams,
        ctx
      }

      if (upsertConfig.upsertOneOverride) {
        return upsertConfig.upsertOneOverride(overrideOptions)
      } else if (allUpsertConfig.upsertOneOverride) {
        return allUpsertConfig.upsertOneOverride(overrideOptions)
      }

      return upsertAndNotify({
        modelName,
        prismaParams,
        apiConfig
      })
    }
  })
}
