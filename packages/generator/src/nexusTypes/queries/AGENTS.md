# Query Instructions

[Parent instructions](../AGENTS.md)

This directory owns generated Nexus read fields and dispatch to Prisma or configured overrides.

## Contents

- [Ownership](#ownership)
- [Query constraints](#query-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

`aggregate.ts`, `findCount.ts`, `findFirst.ts`, `findMany.ts`, and `findUnique.ts` own their
corresponding operation. `index.ts` owns query exports.

## Query Constraints

Preserve GraphQL field names, nullability/list shapes, Prisma argument forwarding, selection
handling, operation identifiers, and model-before-global override precedence. Verify both default
and override paths when changing shared behavior.

## Verification and Documentation

Run package lint, tests, and build and exercise affected reads through the usage application's real
Prisma context when the boundary changes. See [Architecture](../../../../../docs/architecture.md)
and the [consumer guide](../../../../../README.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../docs/README.md)
