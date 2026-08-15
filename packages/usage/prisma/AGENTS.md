# Example Prisma instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [usage application instructions](../AGENTS.md).

## Purpose and ownership

This directory owns the example Prisma schema and checked-in migration history. It directly owns `schema.prisma` and the `migrations/` child.

Keep schema changes, generated-client expectations, and migrations coordinated. Create a new migration for schema changes rather than rewriting applied history unless the task explicitly resets the example database.

Relevant documentation: [schema-to-API flow](../../../docs/features/schema-to-api.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../docs/README.md)
