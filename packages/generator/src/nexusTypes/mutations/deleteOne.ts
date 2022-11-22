import { DMMF } from '@prisma/generator-helper'
import { mutationField } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ApiConfig, ModelUniqFields } from '../../_types/apiConfig'

export const deleteOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
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
    resolve: async (parent, args, ctx, info) => {
      const { where } = args
      const { prisma, select } = ctx

      if (deleteConfig.beforeDeleteOne) {
        const canDelete = deleteConfig.beforeDeleteOne(parent, args, ctx, info)
        if (!canDelete) { throw new Error('Unauthorized') }
      }

      const uniqFieldSelect = ((ModelUniqFields[modelName as any] || '').split(',')).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = true
        return accumulator
      }, {} as Record<string, boolean>)

      const result = await prisma[modelName].delete({
        where,
        select: {
          ...select.select,
          ...uniqFieldSelect
        }
      })

      apiConfig.pubsub?.publish(`${modelName}_DELETED`, result)

      return result
    }
  })
}
