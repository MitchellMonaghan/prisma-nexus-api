import { DMMF } from '@prisma/generator-helper'
import { mutationField } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const deleteOne = (modelName: string, mutationOutputTypes: DMMF.OutputType) => {
  const mutationName = `deleteOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: modelName,
    args,
    resolve: async (_parent, { where }, { prisma, select }) => {
      return prisma[modelName].delete({
        where,
        ...select
      })
    }
  })
}
