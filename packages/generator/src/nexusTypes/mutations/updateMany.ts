import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ModelUpdateConfiguration } from '../../_types/genericApiConfig'

export const updateMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  updateConfig: ModelUpdateConfiguration,
  inputsWithNoFields:string[]
) => {
  const mutationName = `updateMany${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull('BatchPayload'),
    args,
    resolve: async (parent, args, ctx, info) => {
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

      return prisma[modelName].updateMany(args as any)
    }
  })
}
