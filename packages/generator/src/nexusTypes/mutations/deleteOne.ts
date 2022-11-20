import { DMMF } from '@prisma/generator-helper'
import { mutationField } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'
import { ModelDeleteConfiguration } from '../../_types/modelDeleteConfiguration'

export const deleteOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  deleteConfig: ModelDeleteConfiguration,
  inputsWithNoFields:string[]
) => {
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

      return prisma[modelName].delete({
        where,
        ...select
      })
    }
  })
}
