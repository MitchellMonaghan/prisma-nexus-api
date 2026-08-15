# Mutation Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../../README.md) · [Maintainer guide](../../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Mutation contract](#mutation-contract)
- [Verification](#verification)

## Purpose and Owner

Mutation maintainers own generated Nexus mutation fields, default Prisma writes, override dispatch,
and optional publication of mutation events.

## Direct Ownership

- `createOne.ts`, `updateOne.ts`, `updateMany.ts`, `upsertOne.ts`, `deleteOne.ts`, and
  `deleteMany.ts` own their corresponding operations and notify helpers.
- `index.ts` owns the mutation export surface.

## Mutation Contract

For each operation, model-specific overrides take precedence over global overrides; an override
replaces the default Prisma call. Default helpers select unique fields needed by event consumers and
publish only when a pub/sub engine is configured. Bulk operations may read affected items in
addition to writing. Preserve GraphQL return nullability, Prisma operation names, event payloads,
and default event names unless making a documented public-contract change.

## Verification

Test default, global-override, and model-override paths. Verify Prisma parameters, return values,
missing optional pub/sub behavior, custom and default event names, empty arguments, and partial
failure boundaries. Bulk mutation tests must account for their extra reads and database side
effects.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../README.md)
