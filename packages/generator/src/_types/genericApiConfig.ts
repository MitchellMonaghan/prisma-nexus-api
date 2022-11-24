import { BeforeOperationMiddleware, AfterOperationMiddleware } from './operationMiddleware'
// import {
//   AndOperator,
//   OrOperator,
//   NotOperator,
//   ExistsOperator,
//   PropertySelector
// } from './genericPropertySelector'

export type FieldResolver = {
    fieldName: string,
    resolver: (root: any, args: any, ctx: any, info: any) => Promise<any>
}

export type ModelCreateConfiguration = {
    disableAll?: boolean
    disableCreateOne?: boolean
    disableUpsertOne?: boolean
    removedFields?: (string | FieldResolver)[]
    beforeCreateOne?: BeforeOperationMiddleware
    beforeUpsertOne?: BeforeOperationMiddleware
    afterCreateOne?: AfterOperationMiddleware
    afterUpsertOne?: AfterOperationMiddleware
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelReadConfiguration = {
    disableAll?: boolean
    disableAggregate?: boolean
    disableFindCount?: boolean
    disableFindFirst?: boolean
    disableFindMany?: boolean
    disableFindUnique?: boolean
    removedFields?: string[]
    beforeAggregate?: BeforeOperationMiddleware
    beforeFindCount?: BeforeOperationMiddleware
    beforeFindFirst?: BeforeOperationMiddleware
    beforeFindMany?: BeforeOperationMiddleware
    beforeFindUnique?: BeforeOperationMiddleware
    afterAggregate?: AfterOperationMiddleware
    afterFindCount?: AfterOperationMiddleware
    afterFindFirst?: AfterOperationMiddleware
    afterFindMany?: AfterOperationMiddleware
    afterFindUnique?: AfterOperationMiddleware
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    disableUpsertOne?: boolean
    removedFields?: (string | FieldResolver)[]
    beforeUpdateOne?: BeforeOperationMiddleware
    beforeUpdateMany?: BeforeOperationMiddleware
    beforeUpsertOne?: BeforeOperationMiddleware
    afterUpdateOne?: AfterOperationMiddleware
    afterUpdateMany?: AfterOperationMiddleware
    afterUpsertOne?: AfterOperationMiddleware
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelDeleteConfiguration = {
    disableAll?: boolean
    disableDeleteOne?: boolean
    disableDeleteMany?: boolean
    beforeDeleteOne?: BeforeOperationMiddleware
    beforeDeleteMany?: BeforeOperationMiddleware
    afterDeleteOne?: AfterOperationMiddleware
    afterDeleteMany?: AfterOperationMiddleware
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelConfiguration = {
    disableAll?: boolean
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    delete?: ModelDeleteConfiguration
}
