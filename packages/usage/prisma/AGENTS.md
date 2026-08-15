# Usage Prisma Instructions

[Parent instructions](../AGENTS.md)

This directory owns the example application's Prisma data model, generator declarations, datasource
boundary, and migration lineage.

## Contents

- [Ownership](#ownership)
- [Schema and migration constraints](#schema-and-migration-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

- `schema.prisma` owns the example models, enums, Prisma client generator, API generator, and
  `DATABASE_URL` datasource contract.
- `migrations/` is migration history governed by these instructions and is not an ordinary
  hand-edited source directory.

## Schema and Migration Constraints

A schema change affects the database, generated Prisma client, generated API configuration, and
runtime GraphQL schema. Create new migrations through Prisma's supported workflow; do not rewrite
applied migration history. Confirm the selected `DATABASE_URL` before any migration or reset.

## Verification and Documentation

Regenerate artifacts, inspect the generated migration and types, migrate a disposable database,
and exercise affected GraphQL operations. See
[Development and operations](../../../docs/development.md) and
[Architecture](../../../docs/architecture.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../docs/README.md)
