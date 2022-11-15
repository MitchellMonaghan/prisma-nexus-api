import { queryField, nonNull, list } from 'nexus'

export const CarFindManyQuery = queryField('findManyCar', {
  type: nonNull(list(nonNull('Car'))),
  args: {
    where: 'CarWhereInput',
    orderBy: list('CarOrderByWithRelationInput'),
    cursor: 'CarWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('CarScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.car.findMany({
      ...args,
      ...select,
    })
  },
})
