import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ApiConfig, ModelUniqFields } from '../../_types/apiConfig'

export const updateMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
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
    resolve: async (parent, args, ctx, info) => {
      const { where } = args
      const { prisma } = ctx

      if (updateConfig) {
        const fieldResolvers = await getConfiguredFieldResolvers(
          parent,
          args,
          ctx,
          info,
          updateConfig.removedFields || [])

        args.data = {
          ...args.data,
          ...fieldResolvers
        }
      }

      if (updateConfig.beforeUpdateMany) {
        const canUpdate = updateConfig.beforeUpdateMany(parent, args, ctx, info)
        if (!canUpdate) { throw new Error('Unauthorized') }
      }

      const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = true
        return accumulator
      }, {} as Record<string, boolean>)

      const itemsToBeUpdated = await prisma[modelName].findMany({
        where,
        select: uniqFieldSelect
      })
      const result = await prisma[modelName].updateMany(args)

      apiConfig.pubsub?.publish(`${modelName}_UPDATED`, itemsToBeUpdated)

      return result
    }
  })
}
