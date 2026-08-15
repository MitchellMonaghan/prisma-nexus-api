# Usage Application Instructions

[Parent instructions](../AGENTS.md)

This directory owns the private composed example for the workspace package, including Apollo,
Nexus, Prisma, PostgreSQL development services, and migration state.

## Contents

- [Ownership](#ownership)
- [Commands](#commands)
- [Stateful constraints](#stateful-constraints)
- [Documentation](#documentation)

## Ownership

- `src/` owns application schema assembly and server startup.
- `prisma/` owns the example data model and current migration lineage.
- `.docker/docker-compose.yaml` owns local PostgreSQL and pgAdmin service configuration; this
  repository-tooling directory remains governed here.
- `package.json`, `tsconfig.json`, and `.eslintrc.js` own package workflows and tooling.

Generated output, dependencies, build output, and `prisma/migrations/` do not receive local
instruction files.

## Commands

```sh
pnpm dockerCompose
pnpm dev
pnpm compile
pnpm start
```

Run commands from this directory. `dev` and `start` generate Prisma artifacts and run migrations
before starting the server.

## Stateful Constraints

Set `DATABASE_URL` for the intended disposable database before generation or migration. Inspect
schema and migration effects before running stateful commands. Keep the example aligned with the
workspace generator API, PrismaSelect middleware requirement, and resolver context contract.

## Documentation

- [Development and operations](../../docs/development.md)
- [Architecture](../../docs/architecture.md)
- [Consumer guide](../../README.md)

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../docs/README.md)
