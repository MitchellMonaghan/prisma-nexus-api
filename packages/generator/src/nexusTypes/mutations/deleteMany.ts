import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ModelDeleteConfiguration } from '../../_types/genericApiConfig'

export const deleteMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  deleteConfig: ModelDeleteConfiguration,
  inputsWithNoFields:string[]
) => {
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

      return prisma[modelName].deleteMany({ where } as any)
    }
  })
}
