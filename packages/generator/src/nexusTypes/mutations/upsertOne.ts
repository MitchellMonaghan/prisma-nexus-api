import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ModelCreateConfiguration } from '../../_types/genericApiConfig'

export const upsertOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  createConfiguration?: ModelCreateConfiguration
) => {
  const mutationName = `upsertOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (parent, args, ctx, info) => {
      const { create } = args
      const { prisma, select } = ctx

      if (createConfiguration) {
        const removedFields = createConfiguration.removedFields || []

        for (let i = 0; i < removedFields.length; i++) {
          const removedField = removedFields[i]
          const isString = typeof removedField === 'string'

          if (isString) { continue }

          create[removedField.fieldName] = await removedField.resolver(parent, args, ctx, info)
        }
      }

      return prisma[modelName].upsert({
        ...args,
        ...select
      })
    }
  })
}
