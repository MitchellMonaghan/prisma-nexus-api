import { queryField, list } from 'nexus'

export const CarAggregateQuery = queryField('aggregateCar', {
  type: 'AggregateCar',
  args: {
    where: 'CarWhereInput',
    orderBy: list('CarOrderByWithRelationInput'),
    cursor: 'CarWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.car.aggregate({ ...args, ...select }) as any
  },
})
