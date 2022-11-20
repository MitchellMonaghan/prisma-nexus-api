import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs } from '../getNexusArgs'

export const deleteMany = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
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
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma[modelName].deleteMany({ where } as any)
    }
  })
}
