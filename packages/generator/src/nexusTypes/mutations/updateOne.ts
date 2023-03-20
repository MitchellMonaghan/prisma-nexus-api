import { DMMF } from '@prisma/generator-helper'
import { mutationField, nonNull } from 'nexus'
import { isEmpty } from 'lodash'

import { getNexusOperationArgs, getModelUniqFieldSelect } from '../utils'
import { ApiConfig, OperationOverrideOptions } from '../../_types'

export interface UpdateAndNotifyOptions extends OperationOverrideOptions<any, any> {
  modelName: string
  prismaParams: any
  apiConfig: ApiConfig
  updateEvent?: string
}

export const updateAndNotify = async (options:UpdateAndNotifyOptions) => {
  const {
    modelName,
    prismaParams,
    apiConfig,
    updateEvent
  } = options
  const { prisma, pubsub } = apiConfig
  const prismaModel = (prisma as any)[modelName]

  const uniqFieldSelect = getModelUniqFieldSelect(modelName)

  const selectStatement = {
    ...prismaParams.select,
    ...uniqFieldSelect
  }

  console.log('updateAndNotify')
  console.log(typeof prismaModel?.update)
  console.log(JSON.stringify(prismaParams))
  console.log(JSON.stringify(uniqFieldSelect))
  console.log(JSON.stringify(selectStatement))

  const result = await prismaModel.update({
    ...prismaParams,
    select: selectStatement
  })

  console.log('after updateAndNotify')

  pubsub?.publish(updateEvent || `${modelName}_UPDATED`, result)

  console.log('after notify')

  return result
}

export const updateOne = (
  modelName: string,
  mutationOutputTypes: DMMF.OutputType,
  apiConfig: ApiConfig,
  inputsWithNoFields:string[]
) => {
  const allConfig = apiConfig.data.all || {}
  const allUpdateConfig = allConfig?.update || {}
  const modelConfig = apiConfig.data[modelName] || {}
  const updateConfig = modelConfig.update || {}
  const mutationName = `updateOne${modelName}`
  const args = getNexusOperationArgs(mutationName, mutationOutputTypes, inputsWithNoFields)

  if (isEmpty(args)) {
    return
  }

  return mutationField(mutationName, {
    type: nonNull(modelName),
    args,
    resolve: async (_parent, args, ctx) => {
      if (!args.data) { args.data = {} }
      const { select } = ctx
      const prismaParams = {
        ...args,
        ...select
      }

      const overrideOptions:OperationOverrideOptions<any, any> = {
        modelName,
        prismaOperation: 'update',
        prismaParams,
        ctx,
        apiConfig
      }

      if (updateConfig.updateOneOverride) {
        return updateConfig.updateOneOverride(overrideOptions)
      } else if (allUpdateConfig.updateOneOverride) {
        return allUpdateConfig.updateOneOverride(overrideOptions)
      }

      return updateAndNotify(overrideOptions)
    }
  })
}
