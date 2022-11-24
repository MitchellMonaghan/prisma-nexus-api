import { PrismaClient } from '@prisma/client'
import { PubSubEngine } from 'graphql-subscriptions'

import { ModelConfiguration } from './genericApiConfig'
export type ApiConfig = {
    prisma: PrismaClient
    pubsub?: PubSubEngine
    data: Record<string, ModelConfiguration>
}

export enum ModelUniqFields {}
