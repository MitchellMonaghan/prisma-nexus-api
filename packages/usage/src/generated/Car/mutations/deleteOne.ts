import { mutationField, nonNull } from 'nexus'

export const CarDeleteOneMutation = mutationField('deleteOneCar', {
  type: 'Car',
  args: {
    where: nonNull('CarWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.car.delete({
      where,
      ...select,
    })
  },
})
