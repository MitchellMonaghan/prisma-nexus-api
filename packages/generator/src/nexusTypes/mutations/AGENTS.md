# Mutation Instructions

[Parent instructions](../AGENTS.md)

This directory owns generated Nexus mutation fields, mutation override dispatch, Prisma writes, and
optional publication helpers.

## Contents

- [Ownership](#ownership)
- [Mutation constraints](#mutation-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

`createOne.ts`, `updateOne.ts`, `updateMany.ts`, `upsertOne.ts`, `deleteOne.ts`, and `deleteMany.ts`
own the corresponding operation and helper. `index.ts` owns mutation exports.

## Mutation Constraints

Preserve operation names, argument shapes, override precedence, Prisma operation selection, result
shapes, event defaults, and payloads unless compatibility is intentionally changed. Multi-step
read/write/publish helpers require fault-oriented review because database changes and publication
are not one transaction.

## Verification and Documentation

Run package lint, tests, and build; exercise changed writes against a disposable database and verify
published payloads when applicable. See [Architecture](../../../../../docs/architecture.md) and
[Development and operations](../../../../../docs/development.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../docs/README.md)
