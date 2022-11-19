import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const createOne = (modelName: string, mutationOutputTypes?: DMMF.OutputType) => {
  const mutationName = `createOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve (_parent, { data }, { prisma, select }) {
      return prisma[modelName].create({
        data,
        ...select
      })
    }
  })
}
