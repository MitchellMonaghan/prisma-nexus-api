import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const deleteMany = (modelName: string, mutationOutputTypes?: DMMF.OutputType) => {
  const mutationName = `deleteMany${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull('BatchPayload'),
    args,
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma[modelName].deleteMany({ where } as any)
    }
  })
}
