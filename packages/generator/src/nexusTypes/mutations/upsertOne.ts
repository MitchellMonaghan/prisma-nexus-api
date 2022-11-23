import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ApiConfig, ModelUniqFields } from '../../_types/apiConfig'

export const upsertOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const modelConfig = apiConfig.data[modelName] || {}
  const createConfig = modelConfig.create || {}
  const updateConfig = modelConfig.update || {}

  const mutationName = `upsertOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (parent, args, ctx, info) => {
      if (!args.where) { args.where = {} }
      if (!args.create) { args.create = {} }
      if (!args.update) { args.update = {} }

      const { prisma, select } = ctx

      if (createConfig) {
        const fieldResolvers = await getConfiguredFieldResolvers(
          parent,
          args,
          ctx,
          info,
          createConfig.removedFields || [])

        args.create = {
          ...args.create,
          ...fieldResolvers
        }
      }

      if (updateConfig) {
        const fieldResolvers = await getConfiguredFieldResolvers(
          parent,
          args,
          ctx,
          info,
          updateConfig.removedFields || [])

        args.update = {
          ...args.update,
          ...fieldResolvers
        }
      }

      if (createConfig.beforeUpsertOne) {
        const canCreate = await createConfig.beforeUpsertOne(parent, args, ctx, info)
        if (!canCreate) { throw new Error('Unauthorized') }
      }
      if (updateConfig.beforeUpsertOne) {
        const canUpdate = await updateConfig.beforeUpsertOne(parent, args, ctx, info)
        if (!canUpdate) { throw new Error('Unauthorized') }
      }

      const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = true
        return accumulator
      }, {} as Record<string, boolean>)

      const count = await prisma[modelName].count({
        ...args
      })
      const itemExists = count > 0

      const result = await prisma[modelName].upsert({
        ...args,
        select: {
          ...select.select,
          ...uniqFieldSelect
        }
      })

      if (itemExists) {
        if (updateConfig.afterUpdateOne) {
          await updateConfig.afterUpdateOne(result, args, ctx, info)
        }
        apiConfig.pubsub?.publish(`${modelName}_UPDATED`, result)
      } else {
        if (createConfig.afterCreateOne) {
          await createConfig.afterCreateOne(result, args, ctx, info)
        }
        apiConfig.pubsub?.publish(`${modelName}_CREATED`, result)
      }

      return result
    }
  })
}
