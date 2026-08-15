# Usage Source Instructions

[Parent instructions](../AGENTS.md) · [Project overview](../../../README.md) · [Maintainer guide](../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Application contract](#application-contract)
- [Verification](#verification)

## Purpose and Owner

Integration-example maintainers own the executable Apollo application in this directory.

## Direct Ownership

- `index.ts` constructs the Prisma client and API configuration, derives Nexus types, configures
  Nexus schema/typegen output, applies PrismaSelect middleware, builds request context, and starts
  the standalone server.
- Runtime-created `generated/` content is generated output and remains governed here without child
  instructions.

## Application Contract

PrismaSelect middleware places the GraphQL-derived selection on context before generated resolvers
run. Request context supplies the shared Prisma client and request. The standalone server listens on
port 4000. Keep output paths valid for both TypeScript execution and compiled JavaScript, and ensure
startup failures remain observable rather than reporting readiness early.

## Verification

Run `pnpm compile` from `packages/usage`. With a disposable database and configured `DATABASE_URL`,
run the application, confirm schema and typegen creation, execute a representative query and
mutation, and verify the generated resolver receives both Prisma and selection context. Stop the
server and database services after the check.

> Parent: [Parent instructions](../AGENTS.md)
