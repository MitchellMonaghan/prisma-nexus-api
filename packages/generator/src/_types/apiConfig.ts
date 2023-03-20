import { PrismaClient } from '@prisma/client'
import { PubSubEngine } from 'graphql-subscriptions'

import { ModelConfiguration } from './genericApiConfig'
export type ApiConfig = {
    prisma: PrismaClient
    pubsub?: PubSubEngine
    data: {
        all: ModelConfiguration
        [key:string]: ModelConfiguration
    }
}

export type OperationOverrideOptions<ParamsType, ContextType> = {
    modelName:string
    prismaOperation:string
    prismaParams: ParamsType
    ctx: ContextType
    apiConfig: ApiConfig
}
export type OperationOverride<T> = (options: OperationOverrideOptions<any, any>) => Promise<T>
