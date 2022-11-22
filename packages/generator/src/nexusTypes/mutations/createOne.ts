import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ApiConfig, ModelUniqFields } from '../../_types/apiConfig'

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
    resolve: async (parent, args, ctx, info) => {
      if (!args.data) { args.data = {} }
      const { prisma, select } = ctx

      if (createConfig) {
        const fieldResolvers = await getConfiguredFieldResolvers(
          parent,
          args,
          ctx,
          info,
          createConfig.removedFields || [])

        args.data = {
          ...args.data,
          ...fieldResolvers
        }
      }

      if (createConfig.beforeCreateOne) {
        const canCreate = createConfig.beforeCreateOne(parent, args, ctx, info)
        if (!canCreate) { throw new Error('Unauthorized') }
      }

      const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = true
        return accumulator
      }, {} as Record<string, boolean>)

      const result = await prisma[modelName].create({
        ...args,
        select: {
          ...select.select,
          ...uniqFieldSelect
        }
      })

      apiConfig.pubsub?.publish(`${modelName}_CREATED`, result)

      return result
    }
  })
}
