import { mutationField, nonNull } from 'nexus'

export const CarUpdateManyMutation = mutationField('updateManyCar', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('CarUpdateManyMutationInput'),
    where: 'CarWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.car.updateMany(args as any)
  },
})
