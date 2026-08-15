# Nexus Type Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../README.md) · [Maintainer guide](../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Runtime contract](#runtime-contract)
- [Verification](#verification)

## Purpose and Owner

Runtime schema maintainers own conversion of Prisma schema metadata and API configuration into
Nexus types and resolvers.

## Direct Ownership

- `index.ts` owns schema loading, DMMF traversal, filtering, model/input/output construction, and
  public mutation-helper exports.
- `utils.ts` owns Nexus argument conversion, unique-field lookup, removed-field resolution, and
  access-rule scaffolding.
- `queries/` owns generated query fields and their override dispatch.
- `mutations/` owns generated mutation fields, writes, override dispatch, and event helpers.
- `scalars/` owns the Prisma-compatible Nexus scalar set.

## Runtime Contract

`getNexusTypes` reads the configured Prisma schema, applies global and model configuration, and
returns the type definitions used by Nexus. Preserve the precedence of model-specific overrides,
global overrides, and default Prisma behavior. Filtering must not leave fields referring to removed
input or output types. Changes to names, nullability, arguments, filtering, overrides, or helper
events are consumer-visible.

## Verification

Run generator lint, tests, and build. Exercise schema construction against models containing
relations, enums, optional fields, lists, and configured removals. Resolver changes require direct
checks of default Prisma dispatch and both override levels.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../README.md)
