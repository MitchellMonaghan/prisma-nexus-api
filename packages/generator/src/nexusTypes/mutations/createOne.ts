import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ModelCreateConfiguration } from '../../_types/genericApiConfig'

export const createOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  createConfiguration?: ModelCreateConfiguration
) => {
  const mutationName = `createOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (parent, args, ctx, info) => {
      const { data } = args
      const { prisma, select } = ctx

      if (createConfiguration) {
        const removedFields = createConfiguration.removedFields || []

        for (let i = 0; i < removedFields.length; i++) {
          const removedField = removedFields[i]
          const isString = typeof removedField === 'string'

          if (isString) { continue }

          data[removedField.fieldName] = await removedField.resolver(parent, args, ctx, info)
        }
      }

      // TODO: Test that all field removals are working as expected
      return prisma[modelName].create({
        data,
        ...select
      })
    }
  })
}
