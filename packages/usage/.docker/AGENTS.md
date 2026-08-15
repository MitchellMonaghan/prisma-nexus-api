# Usage Docker Instructions

[Parent instructions](../AGENTS.md) · [Project overview](../../../README.md) · [Maintainer guide](../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Service contract](#service-contract)
- [Verification and recovery](#verification-and-recovery)

## Purpose and Owner

Usage-environment maintainers own the optional local services used by the example application.

## Direct Ownership

- `docker-compose.yaml` defines PostgreSQL and pgAdmin services, container names, environment
  inputs, restart behavior, and host port bindings.

## Service Contract

The Compose project exposes PostgreSQL on host port 5432 and pgAdmin on host port 5050. These are
local development services, not production deployment definitions. Keep credentials out of
committed changes and ensure the application's `DATABASE_URL` matches the chosen PostgreSQL service
configuration.

## Verification and Recovery

Before startup, check for host-port conflicts and review the effective Compose configuration. Run
`pnpm dockerCompose` from `packages/usage`, verify database readiness separately from container
startup, and then exercise Prisma connectivity. Stop the foreground process when finished. Use
`docker compose -f packages/usage/.docker/docker-compose.yaml down` from the repository root to
remove the Compose containers and network without requesting volume deletion.

> Parent: [Parent instructions](../AGENTS.md)
