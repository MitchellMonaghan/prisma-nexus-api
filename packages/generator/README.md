# prisma-nexus-api

The intention of this project is the following:
1. Single package with prisma generator and `getNexusTypes` helper fuction.
2. Using prisma generator, a `ApiConfig` type is generated based on db schema. The generated types are to help with auto completion/configuration.
3. The function `getNexusTypes` takes a options object that contains this `ApiConfig`.
4. `getNexusTypes` returns all needed nexus types based on the `ApiConfig` (`queries`, `mutations`, `inputs`, `outputs`, and `models`.
5. Users can use the nexus `extendType` to extend the types generated at runtime.

See the [/packages/usage](https://github.com/MitchellMonaghan/prisma-nexus-api/tree/main/packages/usage) for an example

<br/>

# Prisma Generator Usage
To use the prisma generator, add it to your prisma schema file.

```prisma
generator api {
  provider = "prisma-nexus-api"
}
```

You can then run
```
npx prisma generate
```
This will generate all typing needed for your api.

The generator can also have a `schemaPath` property configured. The default schema path is `./prisma/schema.prisma`.<br/><br/>

# Plugin Usage

To use `getNexusTypes`, call it with your `ApiConfig`. Then pass these types to nexus.

>Note you must use the @paljs/nexus plugin. This adds functionality to convert graphql info into a prisma select statement used by our operations.

```typescript
import { makeSchema } from 'nexus'
import { getNexusTypes, ApiConfig } from 'prisma-nexus-api'
import { paljs } from '@paljs/nexus'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiConfig:ApiConfig = {
  prisma,
  data: {
    all: {}
  }
}

const getSchema = async () => {
  const types = await getNexusTypes({
    apiConfig
  })

  return makeSchema({
    types,
    plugins: [
      paljs()
    ],
    outputs: {
      schema: path.join(__dirname, './generated/nexus/schema.graphql'),
      typegen: path.join(__dirname, './generated/nexus/nexus.ts')
    }
  })
}
```
<br/>

# Configruation
You must pass your prismaClient to `ApiConfig`. You can optionally pass a `PubSubEngine` for publishing subscription events. See [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) for more on the `PubSubEngine`.

A `ApiConfig` can specify a `ModelConfiguration` for each model in your db. The prisma generator will generate typescript typing to help with auto completion of your apiConfiguration object. There is also a `all` `ModelConfiguration` which will be applied to all models.

```typescript
const apiConfig:ApiConfig = {
    prisma: PrismaClient,
    pubsub?: PubSubEngine,
    data: {
        all: ModelConfiguration,
        User: ModelConfiguration
        Car: ModelConfiguration,
        ...etc
    }
}
```

A `ModelConfiguration` can then have configuration for each supported operation type, `create`, `read`, `update`, `upsert`, `delete`.

```typescript
export type ModelConfiguration = {
    removeFromSchema?: boolean
    disableAllOperations?: boolean
    create?: ModelCreateConfiguration
    read?: ModelReadConfiguration
    update?: ModelUpdateConfiguration
    upsert?: ModelUpsertConfiguration
    delete?: ModelDeleteConfiguration
}

export type ModelCreateConfiguration = {
    disableAll?: boolean
    removedFields?: string[]
    createOneOverride?: OperationOverride
}

export type ModelReadConfiguration = {
    disableAll?: boolean
    disableAggregate?: boolean
    disableFindCount?: boolean
    disableFindFirst?: boolean
    disableFindMany?: boolean
    disableFindUnique?: boolean
    removedFields?: string[]
    aggregateOverride?: OperationOverride
    findCountOverride?: OperationOverride
    findFirstOverride?: OperationOverride
    findManyOverride?: OperationOverride
    findUniqueOverride?: OperationOverride
}

export type ModelUpdateConfiguration = {
    disableAll?: boolean
    disableUpdateOne?: boolean
    disableUpdateMany?: boolean
    removedFields?: string[]
    updateOneOverride?: OperationOverride
    updateManyOverride?: OperationOverride
}

export type ModelUpsertConfiguration = {
    disableAll?: boolean
    upsertOneOverride?: OperationOverride
}

export type ModelDeleteConfiguration = {
    disableAll?: boolean
    disableDeleteOne?: boolean
    disableDeleteMany?: boolean
    deleteOneOverride?: OperationOverride
    deleteManyOverride?: OperationOverride
}
```

Removing fields from the `create` configuration removes fields from the exposed create input.<br/>
Removing fields from the `update` configuration removes fields from the exposed update input.<br/>
Removing fields from the `read` configuration removes the fields from the graphql outputs.<br/><br/>

You can disable any specific operation, `disableAggregate`, `disableFindCount` etc<br/>

Using `disableAll` will disable all operations in that grouping. Ex. `ModelDeleteConfiguration` `disableAll` will disable both `disableDeleteOne` and `deleteManyOverride`. Using the top level `disableAllOperations` will disable all operations for that model.<br/>

`removeFromSchema` will remove the model from the schema and `disableAllOperations`. You can `disableAllOperations` but not remove the schema to allow you to use the model, input, and output types for your own custom operations. <br/><br/>

# Override

The override functions are a hook you can use for the incomming operation. These allow you to add custom validation, permission checks, or custom logic. If you don't need your validation/authorized checks in this level of scope I suggest using [graphql-shield](https://the-guild.dev/graphql/shield/docs)

> ### Note the prisma function will no longer be called by default when using the override hook.

<br/>Your override function will recieve the following parameter.

```typescript
export type OperationOverrideOptions<ParamsType, ContextType> = {
    // car, user, etc
    modelName:string
    // create, update, etc
    prismaOperation:string
    prismaParams: ParamsType
    ctx: ContextType
    apiConfig: ApiConfig
}
```

The `modelName` and `prismaOperation` are passed to allow you to use generic handlers for multiple operations. Ex.

```typescript
export const operationFilterForOrganizationOverride = (options:OperationOverrideOptions<any, any>) => {
  const {
    modelName,
    prismaOperation,
    prismaParams,
    ctx
  } = options
  const session = ctx.session

  options.prismaParams.where = {
    ...options.prismaParams.where,
    organizationId: session.organizationId
  }

  return (ctx.prisma as any)[modelName][prismaOperation](options.prismaParams)
}
```

# Helper Functions

There are a few helper functions exposed. `createAndNotify`, `updateAndNotify`, `updateManyAndNotify`, etc. These will run their mutations and also publish the event to the subscription pubsub if one is configured. These functions take the override params with an additional option to configure your event.

```typescript
export interface CreateAndNotifyOptions extends OperationOverrideOptions {
  createEvent?: string
}
```

By default these events are `modelName_CREATED`, `car_CREATED`, `user_UPDATED`, `book_DELETED` etc.