import path from 'path'
import { getDMMF, getSchemaSync } from '@prisma/internals'

const samplePrismaSchema = getSchemaSync(path.join(__dirname, './sample.prisma'))

export const getSampleDMMF = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema
  })
}
