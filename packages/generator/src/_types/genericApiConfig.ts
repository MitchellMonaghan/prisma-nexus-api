import { AccessRule } from './accessRule'
import { ModelDeleteConfiguration } from './modelDeleteConfiguration'

export type FieldResolver = {
    fieldName: string,
    resolver: (root: any, args: any, ctx: any, info: any) => Promise<any>
}

export type ModelCreateConfiguration = {
    disableAll?: boolean
    disableCreate?: boolean
    disableUpsert?: boolean
    removedFields?: (string | FieldResolver)[]
}

export type ModelReadConfiguration = {
    disableAll?: boolean
    disableAggregate?: boolean
    disableFindCount?: boolean
    disableFindFirst?: boolean
    disableFindMany?: boolean
    disableFindUnique?: boolean
    removedFields?: string[]
}

export type ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    disableUpsert?: boolean
    removedFields?: (string | FieldResolver)[]
}

export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    access?: AccessRule[]
}
