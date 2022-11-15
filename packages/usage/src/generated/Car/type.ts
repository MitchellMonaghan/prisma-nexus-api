import { objectType } from 'nexus'

export const Car = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Car',
  definition(t) {
    t.int('id')
    t.string('color')
  },
})
