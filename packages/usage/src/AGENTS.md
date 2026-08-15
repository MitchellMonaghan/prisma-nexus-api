# Usage Source Instructions

[Parent instructions](../AGENTS.md)

This directory owns the composed Apollo example's schema assembly, middleware, request context, and
server lifecycle.

## Contents

- [Ownership](#ownership)
- [Runtime constraints](#runtime-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

`index.ts` owns Prisma client creation, `ApiConfig`, Nexus schema generation, PrismaSelect
middleware, Apollo context, output paths, and startup on port 4000.

## Runtime Constraints

Keep `ctx.prisma` available to default query resolvers and keep PrismaSelect-derived selection data
available before generated resolvers execute. Disconnect or otherwise account for long-lived Prisma
resources when changing lifecycle behavior. Generated Nexus outputs are artifacts, not independent
sources of truth.

## Verification and Documentation

Compile the package and run it against a disposable migrated database. Exercise affected GraphQL
operations through Apollo rather than validating schema construction alone. See
[Architecture](../../../docs/architecture.md) and
[Development and operations](../../../docs/development.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../docs/README.md)
