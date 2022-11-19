import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'

import { getNexusOperationArgs, getConfiguredFieldResolvers } from '../getNexusArgs'
import { ModelConfiguration } from '../../_types/genericApiConfig'

export const upsertOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  modelConfig: ModelConfiguration,
  inputsWithNoFields:string[]
) => {
  const mutationName = `upsertOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (parent, args, ctx, info) => {
      if (!args.create) { args.create = {} }
      if (!args.update) { args.update = {} }

      const { prisma, select } = ctx

      const createConfig = modelConfig?.create || {}
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

      const updateConfig = modelConfig?.update || {}
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

      if (args.where) {
        return prisma[modelName].upsert({
          ...args,
          ...select
        })
      } else {
        return prisma[modelName].create({
          data: args.create,
          ...select
        })
      }
    }
  })
}
