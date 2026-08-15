# Development and Operations

> Parent: [Documentation index](README.md)

This guide is for contributors building the generator and running the stateful usage application.
It separates repeatable package verification from commands that generate files, modify PostgreSQL,
or start long-running services.

## Contents

- [Prerequisites](#prerequisites)
- [Install the workspace](#install-the-workspace)
- [Develop the generator](#develop-the-generator)
- [Run the usage application](#run-the-usage-application)
- [Side effects and recovery](#side-effects-and-recovery)
- [Verification](#verification)

## Prerequisites

- Node.js 16 or newer, matching the published generator's engine boundary.
- pnpm; CI currently installs pnpm 7.
- Docker Compose when using the example PostgreSQL and pgAdmin services.
- A `DATABASE_URL` accepted by the PostgreSQL datasource in the usage Prisma schema. Keep its value
  outside version control and make it match the database selected for the workflow.

## Install the Workspace

From the repository root:

```sh
pnpm install
```

Installation resolves both workspace packages. Lifecycle scripts install the root Husky hooks and
compile the generator where its package lifecycle requires it.

## Develop the Generator

Run the generator's commands from its package directory:

```sh
cd packages/generator
pnpm build
pnpm lint
pnpm test
```

`build` compiles TypeScript, `lint` checks TypeScript with ESLint, and `test` runs Jest through the
package's ts-jest configuration. Run all applicable commands after changing exported types,
generator output, schema construction, resolvers, or scalar behavior.

## Run the Usage Application

Start the example services in one terminal:

```sh
cd packages/usage
pnpm dockerCompose
```

After setting `DATABASE_URL`, run the development workflow in another terminal:

```sh
cd packages/usage
pnpm dev
```

The development script runs Prisma client and API type generation, runs `prisma migrate dev`, and
then starts the TypeScript Apollo application. The server listens on port 4000. The Compose file
publishes PostgreSQL on port 5432 and pgAdmin on port 5050; those ports must be available.

The production-style package script is:

```sh
cd packages/usage
pnpm start
```

It compiles the application, generates Prisma artifacts, applies the package's migration command,
and starts `dist/index.js`. This is still an example workflow and retains the same database side
effects.

## Side Effects and Recovery

- `prisma generate` writes Prisma and `prisma-nexus-api` generated artifacts.
- `prisma migrate dev` can update the selected database and create migration history when the schema
  has changed. Inspect proposed migrations before committing them; do not edit existing migration
  history to represent a new change.
- The application writes Nexus schema and type-generation output under its generated source output
  path while building the schema.
- The mutation notification helpers can write database state and then publish events. A publication
  failure does not imply that the preceding database operation was rolled back.
- Stop foreground application or Compose processes with the terminal interrupt. To stop and remove
  the example Compose containers and network, run:

```sh
cd packages/usage
docker compose -f ./.docker/docker-compose.yaml down
```

Stopping services does not reverse database migrations. Use Prisma's supported migration workflow
and a deliberate backup or reset strategy appropriate to the selected non-production database.

## Verification

The push workflow installs dependencies and runs the generator's Jest and build commands across
Ubuntu, Windows, and macOS jobs. It does not define usage-package tests or a database-backed
acceptance run.

For generator-only changes, run `pnpm lint`, `pnpm test`, and `pnpm build` in
`packages/generator`. For changes to generated contracts or the composed runtime, also configure a
disposable usage database, run the usage generation and migration workflow, start the application,
and exercise the affected GraphQL operation through the real Prisma boundary. Report any boundary
that could not be exercised.
