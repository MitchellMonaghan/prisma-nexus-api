# Usage application

> Parent: [Parent index](README.md)

[Back to the component index](README.md)

## Table of contents

- [Purpose](#purpose)
- [Server composition](#server-composition)
- [Local workflows](#local-workflows)
- [Boundaries and gaps](#boundaries-and-gaps)

## Purpose

`packages/usage` is a private workspace application demonstrating the generator package with Prisma, Nexus, Apollo Server, GraphQL middleware, and `PrismaSelect`. Evidence: [`packages/usage/package.json`](../../packages/usage/package.json) and [`packages/usage/src/index.ts`](../../packages/usage/src/index.ts).

## Server composition

The application creates a Prisma client, calls `getNexusTypes`, builds a Nexus schema, and applies middleware that stores a Prisma selection in `ctx.select`. It starts an Apollo standalone server on port 4000 and supplies `prisma` and the incoming request through context. Generated Nexus schema and type files are directed below `src/generated/nexus`. Evidence: [`packages/usage/src/index.ts`](../../packages/usage/src/index.ts).

The generator query and mutation resolvers merge selection information from context into Prisma parameters. Evidence: [`packages/generator/src/nexusTypes/queries/findMany.ts`](../../packages/generator/src/nexusTypes/queries/findMany.ts) and [`packages/generator/src/nexusTypes/mutations/createOne.ts`](../../packages/generator/src/nexusTypes/mutations/createOne.ts).

## Local workflows

The usage manifest defines development, compilation, startup, migration, and Docker Compose scripts. All are unverified in this proposal:

```text
pnpm --dir packages/usage dev
pnpm --dir packages/usage compile
pnpm --dir packages/usage start
pnpm --dir packages/usage migrate
pnpm --dir packages/usage dockerCompose
```

Evidence: [`packages/usage/package.json`](../../packages/usage/package.json), [`packages/usage/.docker/docker-compose.yaml`](../../packages/usage/.docker/docker-compose.yaml), and [`packages/usage/prisma/schema.prisma`](../../packages/usage/prisma/schema.prisma).

## Boundaries and gaps

This is an example, not a published package. The source contains a TODO to replace standalone startup with Express and add WebSocket/subscription setup; that behavior is not implemented by the inventoried source and must not be documented as available. No controlled server, migration, or container execution result was supplied. Evidence: [`packages/usage/package.json`](../../packages/usage/package.json) and [`packages/usage/src/index.ts`](../../packages/usage/src/index.ts).
