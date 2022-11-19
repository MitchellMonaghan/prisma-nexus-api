import { AccessRule } from './accessRule'
import { ModelDeleteConfiguration } from './modelDeleteConfiguration'

export type FieldResolver = {
    fieldName: string,
    resolver: (root: any, args: any, ctx: any, info: any) => Promise<any>
}

export type ModelCreateConfiguration = {
    disabled?: boolean
    removedFields?: (string | FieldResolver)[]
}

export type ModelReadConfiguration = {
    disabled?: boolean
    removedFields?: string[]
}

export type ModelUpdateConfiguration = {
    disabled?: boolean
    removedFields?: (string | FieldResolver)[]
}

export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    access?: AccessRule[]
}
