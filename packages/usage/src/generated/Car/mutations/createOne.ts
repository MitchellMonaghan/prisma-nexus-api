import { mutationField, nonNull } from 'nexus'

export const CarCreateOneMutation = mutationField('createOneCar', {
  type: nonNull('Car'),
  args: {
    data: nonNull('CarCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.car.create({
      data,
      ...select,
    })
  },
})
