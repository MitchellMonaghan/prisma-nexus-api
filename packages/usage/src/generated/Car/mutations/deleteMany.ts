import { mutationField, nonNull } from 'nexus'

export const CarDeleteManyMutation = mutationField('deleteManyCar', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'CarWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.car.deleteMany({ where } as any)
  },
})
