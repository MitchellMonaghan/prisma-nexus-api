import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ApiConfig, ModelUniqFields } from '../../_types/apiConfig'

export const deleteMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
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
    resolve: async (parent, args, ctx, info) => {
      const { where } = args
      const { prisma } = ctx

      if (deleteConfig.beforeDeleteMany) {
        const canDelete = await deleteConfig.beforeDeleteMany(parent, args, ctx, info)
        if (!canDelete) { throw new Error('Unauthorized') }
      }

      const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = true
        return accumulator
      }, {} as Record<string, boolean>)

      const itemsToBeDeleted = await prisma[modelName].findMany({
        where,
        select: uniqFieldSelect
      })
      const result = await prisma[modelName].deleteMany({ where })

      if (deleteConfig.afterDeleteMany) {
        await deleteConfig.afterDeleteMany(result, args, ctx, info)
      }

      apiConfig.pubsub?.publish(`${modelName}_DELETED`, itemsToBeDeleted)

      return result
    }
  })
}
