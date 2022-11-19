import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { getNexusOperationArgs } from '../getNexusArgs'

export const updateOne = (modelName: string, mutationOutputTypes?: DMMF.OutputType) => {
  const mutationName = `updateOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes)

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve (_parent, { data, where }, { prisma, select }) {
      return prisma[modelName].update({
        where,
        data,
        ...select
      })
    }
  })
}
