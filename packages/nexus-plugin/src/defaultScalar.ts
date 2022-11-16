import { scalarType, asNexusMethod } from 'nexus'
import {
  JSONResolver,
  BigIntResolver,
  DateResolver
} from 'graphql-scalars'

import { Settings } from './settings'

export const Json = asNexusMethod(JSONResolver, 'json')
export const BigInt = asNexusMethod(BigIntResolver, 'bigint')
export const DateTime = asNexusMethod(DateResolver, 'date')

const defaultScalar = {
  Json,
  Decimal: scalarType({
    name: 'Decimal',
    asNexusMethod: 'decimal',
    description: 'Decimal custom scalar type',
    serialize: (val: any) => parseFloat(val),
    parseValue: (val: any) => parseFloat(val),
    parseLiteral: (ast: any) => parseFloat(ast.value)
  }),
  BigInt,
  DateTime
}

export const getScalars = (excludeScalar: Settings['excludeScalar']) => {
  return (Object.keys(defaultScalar) as (keyof typeof defaultScalar)[])
    .filter((scalar) => !excludeScalar || !excludeScalar.includes(scalar))
    .map((scalar) => defaultScalar[scalar])
}
