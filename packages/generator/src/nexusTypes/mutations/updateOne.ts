import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ModelUpdateConfiguration } from '../../_types/genericApiConfig'

export const updateOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  updateConfig: ModelUpdateConfiguration,
  inputsWithNoFields:string[]
) => {
  const mutationName = `updateOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (parent, args, ctx, info) => {
      if (!args.data) { args.data = {} }
      const { prisma, select } = ctx

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

      return prisma[modelName].update({
        ...args,
        ...select
      })
    }
  })
}
