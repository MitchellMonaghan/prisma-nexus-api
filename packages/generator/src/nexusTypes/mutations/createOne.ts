import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ModelCreateConfiguration } from '../../_types/genericApiConfig'

export const createOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  createConfig: ModelCreateConfiguration,
  inputsWithNoFields:string[]
) => {
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

      // TODO: Test that all field removals are working as expected
      return prisma[modelName].create({
        ...args,
        ...select
      })
    }
  })
}
