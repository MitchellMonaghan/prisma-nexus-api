import { mutationField, nonNull } from 'nexus'

export const CarUpsertOneMutation = mutationField('upsertOneCar', {
  type: nonNull('Car'),
  args: {
    where: nonNull('CarWhereUniqueInput'),
    create: nonNull('CarCreateInput'),
    update: nonNull('CarUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.car.upsert({
      ...args,
      ...select,
    })
  },
})
