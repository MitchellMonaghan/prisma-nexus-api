# Usage Application

Parent: [components index](README.md)

## Contents

- [Purpose](#purpose)
- [Runtime assembly](#runtime-assembly)
- [Database and local services](#database-and-local-services)
- [Commands and side effects](#commands-and-side-effects)
- [Verification](#verification)

## Purpose

`packages/usage/` is a private workspace application demonstrating the generator package with
Prisma, Nexus, Apollo Server, GraphQL middleware, and PrismaSelect. Its dependency on
`prisma-nexus-api` uses `workspace:*` in `packages/usage/package.json`.

## Runtime Assembly

`packages/usage/src/index.ts` creates a Prisma client and an `ApiConfig`, calls `getNexusTypes`, and
passes the returned definitions to Nexus `makeSchema`. It writes Nexus schema and typegen output
beneath `src/generated/nexus/`.

The application applies middleware that derives `ctx.select` from GraphQL resolver information.
The standalone Apollo context supplies `prisma` and the request, and the server listens on port
4000 as currently written.

## Database and Local Services

`packages/usage/prisma/schema.prisma` owns the example Prisma data model.
`packages/usage/prisma/migrations/` contains its inventoried migration history.
`packages/usage/.docker/docker-compose.yaml` supplies the local composition used by the package's
`dockerCompose` script. The supplied excerpt does not establish its exact service, volume, port, or
credential contract.

## Commands and Side Effects

The following commands are declared in `packages/usage/package.json` and remain unverified:

- `pnpm dev` generates Prisma output, runs migrations, and starts the TypeScript source.
- `pnpm start` compiles, generates Prisma output, runs migrations, and starts compiled JavaScript.
- `pnpm migrate` invokes `prisma migrate dev` and can change the configured database and migration
  files.
- `pnpm dockerCompose` starts the composition in `packages/usage/.docker/docker-compose.yaml`.

Inspect database and container configuration before running these commands.

## Verification

No test script is declared in `packages/usage/package.json`, and `.github/workflows/CI.yml` does not
exercise this application. A readiness claim therefore requires direct composed verification of
Prisma generation, database migration, schema creation, middleware selection, and Apollo startup.
