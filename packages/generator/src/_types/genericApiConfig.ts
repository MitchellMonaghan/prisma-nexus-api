// import { AccessRule } from './accessRule'
import { ModelDeleteConfiguration, AfterResolverMiddleware } from './modelDeleteConfiguration'

export type FieldResolver = {
    fieldName: string,
    resolver: (root: any, args: any, ctx: any, info: any) => Promise<any>
}

export type ModelCreateConfiguration = {
    disableAll?: boolean
    disableCreateOne?: boolean
    disableUpsertOne?: boolean
    removedFields?: (string | FieldResolver)[]
    beforeCreateOne?: AfterResolverMiddleware
    beforeUpsertOne?: AfterResolverMiddleware
}

export type ModelReadConfiguration = {
    disableAll?: boolean
    disableAggregate?: boolean
    disableFindCount?: boolean
    disableFindFirst?: boolean
    disableFindMany?: boolean
    disableFindUnique?: boolean
    removedFields?: string[]
    beforeAggregate?: AfterResolverMiddleware
    beforeFindCount?: AfterResolverMiddleware
    beforeFindFirst?: AfterResolverMiddleware
    beforeFindMany?: AfterResolverMiddleware
    beforeFindUnique?: AfterResolverMiddleware
}

export type ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    disableUpsertOne?: boolean
    removedFields?: (string | FieldResolver)[]
    beforeUpdateOne?: AfterResolverMiddleware
    beforeUpdateMany?: AfterResolverMiddleware
    beforeUpsertOne?: AfterResolverMiddleware
}

export type ModelConfiguration = {
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
    // access?: AccessRule[]
}
