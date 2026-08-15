# Usage source instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [usage application instructions](../AGENTS.md).

## Purpose and ownership

This directory owns the example server source. It directly owns `index.ts`.

Keep startup, schema construction, Prisma context, and selection middleware easy to follow. The current example builds Nexus types, applies `PrismaSelect` middleware, starts an Apollo standalone server on port 4000, and exposes Prisma plus the request in context. Update [the usage component guide](../../../docs/components/usage-application.md) when this flow changes.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../docs/README.md)
