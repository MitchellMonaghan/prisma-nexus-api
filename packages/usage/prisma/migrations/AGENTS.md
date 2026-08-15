# Migration instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [Prisma instructions](../AGENTS.md).

## Purpose and ownership

This directory owns ordered, checked-in migration history for the example schema. It directly owns `migration_lock.toml` and the `20230629190044_init/` migration child.

Preserve existing migration files. Add later migrations for new schema changes and inspect generated SQL before use. Migration commands from `packages/usage/package.json` are unverified in this proposal.

Relevant documentation: [schema-to-API flow](../../../../docs/features/schema-to-api.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../docs/README.md)
