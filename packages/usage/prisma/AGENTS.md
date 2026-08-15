# Usage Prisma Instructions

[Parent instructions](../AGENTS.md) · [Project overview](../../../README.md) · [Maintainer guide](../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Schema and migration contract](#schema-and-migration-contract)
- [Verification](#verification)

## Purpose and Owner

Usage data-model maintainers own the example Prisma schema and its durable migration boundary.

## Direct Ownership

- `schema.prisma` defines generator providers, the PostgreSQL datasource, models, relations, and
  enums used by the composed example.
- `migrations/` is generated migration history and remains governed here; it does not receive child
  instructions.

## Schema and Migration Contract

The datasource obtains its connection from `DATABASE_URL`. The `client` generator produces the
Prisma client, while the `api` generator exercises `prisma-nexus-api`. Treat committed migrations as
ordered history: create them through Prisma's migration workflow, review their SQL and data effects,
and do not rewrite an applied migration merely to match a later schema.

## Verification

Run Prisma generation after schema changes and verify both the client and API declaration outputs.
Apply migrations only to a disposable or explicitly approved development database. Review newly
created migration SQL, verify the expected schema, compile the usage application, and exercise an
affected GraphQL operation.

> Parent: [Parent instructions](../AGENTS.md)
