# Query Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../../README.md) · [Maintainer guide](../../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Query contract](#query-contract)
- [Verification](#verification)

## Purpose and Owner

Query maintainers own Nexus query fields that translate GraphQL arguments and context selections
into Prisma reads or configured overrides.

## Direct Ownership

- `aggregate.ts`, `findCount.ts`, `findFirst.ts`, `findMany.ts`, and `findUnique.ts` own their
  corresponding query fields.
- `index.ts` owns the query export surface.

## Query Contract

Model-specific read overrides take precedence over global read overrides; otherwise the resolver
calls the matching Prisma model operation. Preserve public field names, arguments, list and null
semantics, selection propagation, override option data, and Prisma operation names.

## Verification

Test default, global-override, and model-override paths for every changed operation. Assert the
public GraphQL name and type, forwarded arguments and selection, nullable not-found behavior,
collection behavior, and count or aggregate return shape as applicable.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../README.md)
