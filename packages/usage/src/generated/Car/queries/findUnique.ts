import { queryField, nonNull } from 'nexus'

export const CarFindUniqueQuery = queryField('findUniqueCar', {
  type: 'Car',
  args: {
    where: nonNull('CarWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.car.findUnique({
      where,
      ...select,
    })
  },
})
