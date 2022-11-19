import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const upsertOne = (modelName: string, mutationOutputTypes?: DMMF.OutputType) => {
  const mutationName = `upsertOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve (_parent, args, { prisma, select }) {
      return prisma[modelName].upsert({
        ...args,
        ...select
      })
    }
  })
}
