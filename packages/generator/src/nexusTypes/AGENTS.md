# Nexus Runtime Instructions

[Parent instructions](../AGENTS.md)

This directory owns conversion of Prisma schema metadata and API configuration into executable
Nexus types and resolvers.

## Contents

- [Ownership](#ownership)
- [Runtime constraints](#runtime-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

- `index.ts` owns DMMF loading, filtering, model/input/output construction, and assembly.
- `utils.ts` owns argument conversion, removed-field resolution, and unique-field selection.
- `queries/`, `mutations/`, and `scalars/` own their respective GraphQL boundaries.

## Runtime Constraints

Keep configuration precedence consistent: model-specific operation overrides precede `data.all`
overrides, followed by the default Prisma path. Changes to field filtering must preserve valid Nexus
input/output references. Resolver context and generated `ApiConfig` remain shared contracts.

## Verification and Documentation

Run the package lint, test, and build commands and exercise affected GraphQL operations for composed
changes. See [Architecture](../../../../docs/architecture.md) and the
[consumer guide](../../../../README.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../docs/README.md)
