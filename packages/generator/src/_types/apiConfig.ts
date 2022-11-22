import { ModelConfiguration } from './genericApiConfig'
import { PubSubEngine } from 'graphql-subscriptions'

export type ApiConfig = {
    data: Record<string, ModelConfiguration>
    pubsub?: PubSubEngine
}

export enum ModelUniqFields {}
