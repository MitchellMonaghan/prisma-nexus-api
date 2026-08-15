# Example container instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [usage application instructions](../AGENTS.md).

## Purpose and ownership

This directory owns container orchestration used by the example application. It directly owns `docker-compose.yaml`.

Keep service configuration aligned with the Prisma schema and usage scripts. Treat `pnpm --dir packages/usage dockerCompose` as unverified until controlled execution confirms the required container runtime and services work.

Relevant documentation: [usage application](../../../docs/components/usage-application.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../docs/README.md)
