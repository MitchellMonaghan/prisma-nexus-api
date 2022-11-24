import { OperationOverride } from './apiConfig'
// import {
//   AndOperator,
//   OrOperator,
//   NotOperator,
//   ExistsOperator,
//   PropertySelector
// } from './genericPropertySelector'

export type ModelCreateConfiguration = {
    disableAll?: boolean
    removedFields?: string[]
    createOneOverride?: OperationOverride<any>
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
    aggregateOverride?: OperationOverride<any>
    findCountOverride?: OperationOverride<any>
    findFirstOverride?: OperationOverride<any>
    findManyOverride?: OperationOverride<any>
    findUniqueOverride?: OperationOverride<any>
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    removedFields?: string[]
    updateOneOverride?: OperationOverride<any>
    updateManyOverride?: OperationOverride<any>
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelUpsertConfiguration = {
    disableAll?: boolean
    upsertOneOverride?: OperationOverride<any>
}

export type ModelDeleteConfiguration = {
    disableAll?: boolean
    disableDeleteOne?: boolean
    disableDeleteMany?: boolean
    deleteOneOverride?: OperationOverride<any>
    deleteManyOverride?: OperationOverride<any>
    // access?: (AndOperator|OrOperator|NotOperator|ExistsOperator|PropertySelector)[]
}

export type ModelConfiguration = {
    disableAll?: boolean
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    upsert?: ModelUpsertConfiguration
    delete?: ModelDeleteConfiguration
}
