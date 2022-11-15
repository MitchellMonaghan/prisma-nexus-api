import { mutationField, nonNull } from 'nexus'

export const CarUpdateOneMutation = mutationField('updateOneCar', {
  type: nonNull('Car'),
  args: {
    data: nonNull('CarUpdateInput'),
    where: nonNull('CarWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.car.update({
      where,
      data,
      ...select,
    })
  },
})
