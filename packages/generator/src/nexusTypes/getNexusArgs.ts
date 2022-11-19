import { DMMF } from '@prisma/generator-helper'
import { nonNull, list } from 'nexus'

const getType = (arg: DMMF.SchemaArg) => {
  let type = `${arg.inputTypes[0].type}` as any

  if (arg.inputTypes[0].isList) {
    type = list(`${type}`)
  }

  if (arg.isRequired) {
    type = nonNull(type)
  }

  return type
}

export const getNexusArgs = (args: DMMF.SchemaArg[]) => {
  const nexusArgs = {} as Record<string, any>
  args.forEach((arg) => {
    nexusArgs[arg.name] = getType(arg)
  })

  return nexusArgs
}

export const getNexusOperationArgs = (mutationName: string, mutationOutputTypes: DMMF.OutputType) => {
  const mutationPrismaType = mutationOutputTypes.fields.find(f => f.name === mutationName)
  return getNexusArgs(mutationPrismaType?.args || [])
}
