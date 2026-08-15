# Usage Package Instructions

[Parent instructions](../AGENTS.md) · [Project overview](../../README.md) · [Maintainer guide](../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Local contract](#local-contract)
- [Commands and side effects](#commands-and-side-effects)

## Purpose and Owner

Integration-example maintainers own this private Apollo, Nexus, and Prisma application. It proves a
composed consumer workflow for the local generator package and is not a separately published
package.

## Direct Ownership

- `src/` owns application schema assembly and server startup.
- `prisma/` owns the example data model and migration boundary.
- `.docker/` owns optional local PostgreSQL and pgAdmin services.
- `package.json` owns usage scripts and the `workspace:*` dependency on the generator.
- `.eslintrc.js`, `tsconfig.json`, and `.gitignore` own local tooling behavior.

## Local Contract

Keep this package consuming `prisma-nexus-api` through the workspace. The application requires a
`DATABASE_URL`, constructs Prisma and generated Nexus types, applies PrismaSelect middleware, and
starts a standalone Apollo Server. Credentials and environment-specific URLs must remain outside
source control.

## Commands and Side Effects

- `pnpm compile` type-checks and compiles the application.
- `pnpm dockerCompose` starts local database administration services and binds ports 5432 and 5050.
- `pnpm dev` runs Prisma generation, development migration, and the TypeScript server.
- `pnpm start` compiles, generates, migrates, and starts compiled JavaScript.

Generation writes files and migration changes database state. Read the child instructions and the
maintainer guide before running stateful commands. Verify application changes with compilation and,
when relevant, a disposable database plus a representative GraphQL operation.

> Parent: [Parent instructions](../AGENTS.md)
