# Generator Package

Parent: [components index](README.md)

## Contents

- [Purpose](#purpose)
- [Package boundaries](#package-boundaries)
- [Prisma generation](#prisma-generation)
- [Runtime schema construction](#runtime-schema-construction)
- [Configuration and overrides](#configuration-and-overrides)
- [Mutation notifications](#mutation-notifications)
- [Verification](#verification)

## Purpose

`packages/generator/` is the published `prisma-nexus-api` package. Its public entry point exports
Nexus construction and API configuration types from `packages/generator/src/index.ts`; its CLI
entry point is `packages/generator/src/bin.ts`.

## Package Boundaries

- `packages/generator/src/prismaGenerator/` creates schema-specific TypeScript declarations.
- `packages/generator/src/nexusTypes/` converts Prisma DMMF data into Nexus types and resolvers.
- `packages/generator/src/_types/` owns shared runtime configuration shapes.
- `packages/generator/src/utils/writeFileSafely.ts` owns generated-file creation.

## Prisma Generation

`packages/generator/src/prismaGenerator/index.ts` registers Prisma generator callbacks. During
generation it combines output from `genApiConfigAccessRules.ts` and `genApiConfigTypes.ts`, then
writes `apiConfig.d.ts` to the configured output or its default output directory.

`packages/generator/src/prismaGenerator/genApiConfigTypes.ts` also derives unique fields from the
DMMF and writes `packages/generator/src/_types/uniqFields.json`. This makes schema generation a
filesystem-writing workflow.

## Runtime Schema Construction

`getNexusTypes` in `packages/generator/src/nexusTypes/index.ts` reads a Prisma schema, obtains its
DMMF, and constructs enums, input types, aggregate/count outputs, model types, queries, mutations,
a `BatchPayload`, and selected scalar adapters. Global and model-specific configuration can remove
fields, models, nested writes, or operations.

Query implementations are under `packages/generator/src/nexusTypes/queries/`; mutation
implementations are under `packages/generator/src/nexusTypes/mutations/`; scalar adapters are under
`packages/generator/src/nexusTypes/scalars/`.

## Configuration and Overrides

`packages/generator/src/_types/genericApiConfig.ts` defines create, read, update, upsert, and delete
configuration groups. Resolver implementations check a model-specific override before the `all`
configuration override and otherwise invoke their default Prisma operation.

The resolver context must supply the Prisma and selection data used by the affected resolver. The
example middleware that supplies selection data is in `packages/usage/src/index.ts`.

## Mutation Notifications

Default mutation helpers optionally publish through `ApiConfig.pubsub`. Event names are derived
from the model name unless an explicit event is provided. Several helpers perform more than one
Prisma read/write call; the inventoried code does not establish a transaction or recovery contract
for those sequences.

## Verification

The following scripts are declared by `packages/generator/package.json` but remain unverified in
this proposal:

- `pnpm test`
- `pnpm build`
- `pnpm lint`

`.github/workflows/CI.yml` invokes test and build. No test source files or controlled execution
results were present in the supplied inventory, so behavior and coverage remain unproven.
