import { queryField, nonNull, list } from 'nexus'

export const CarFindCountQuery = queryField('findManyCarCount', {
  type: nonNull('Int'),
  args: {
    where: 'CarWhereInput',
    orderBy: list('CarOrderByWithRelationInput'),
    cursor: 'CarWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('CarScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.car.count(args as any)
  },
})
