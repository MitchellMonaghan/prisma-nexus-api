import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const updateMany = (modelName: string, mutationOutputTypes: DMMF.OutputType) => {
  const mutationName = `updateMany${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull('BatchPayload'),
    args,
    resolve (_parent, args, { prisma }) {
      return prisma[modelName].updateMany(args as any)
    }
  })
}
