import { queryField, list } from 'nexus'

export const CarFindFirstQuery = queryField('findFirstCar', {
  type: 'Car',
  args: {
    where: 'CarWhereInput',
    orderBy: list('CarOrderByWithRelationInput'),
    cursor: 'CarWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('CarScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.car.findFirst({
      ...args,
      ...select,
    })
  },
})
