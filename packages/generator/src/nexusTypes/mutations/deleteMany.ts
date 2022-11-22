import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ApiConfig } from '../../_types/apiConfig'

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
        const canDelete = deleteConfig.beforeDeleteMany(parent, args, ctx, info)
        if (!canDelete) { throw new Error('Unauthorized') }
      }

      // TODO: Can we get the primary key in a more generic way?
      // what if table doesnt have a id column?
      // I want to guarantee that the pk/uniq identifier is passed to subscription resolver
      const itemsToBeDeleted = await prisma[modelName].findMany({
        where
        // select: {
        //   id: true
        // }
      })
      const result = await prisma[modelName].deleteMany({ where })

      apiConfig.pubsub?.publish(`${modelName}_DELETED`, itemsToBeDeleted)

      return result
    }
  })
}
