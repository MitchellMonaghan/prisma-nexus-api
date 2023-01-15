import { BigInt } from './BigInt'
import { Bytes } from './Bytes'
import { DateTime } from './DateTime'
import { Decimal } from './Decimal'
import { Json } from './Json'

const defaultScalar = {
  BigInt,
  Bytes,
  DateTime,
  Decimal,
  Json
}

export type ExcludeScalar = ('Json' | 'Decimal' | 'BigInt' | 'DateTime' | 'Bytes')[];

export const getScalars = (excludeScalar: ExcludeScalar) => {
  return (Object.keys(defaultScalar) as (keyof typeof defaultScalar)[])
    .filter((scalar) => !excludeScalar || !excludeScalar.includes(scalar))
    .map((scalar) => defaultScalar[scalar])
}
