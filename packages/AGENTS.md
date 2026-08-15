# Package Workspace Instructions

[Parent instructions](../AGENTS.md)

This directory owns the pnpm workspace's maintained packages and their dependency relationship.

## Contents

- [Ownership](#ownership)
- [Workspace rules](#workspace-rules)
- [Documentation](#documentation)

## Ownership

- `generator/` owns the published `prisma-nexus-api` package.
- `usage/` owns the private composed example application.

Read each package's local `AGENTS.md` before editing it.

## Workspace Rules

Keep the `workspace:*` dependency from the usage package aligned with the generator's exported
contract. A change to generated types or runtime schema behavior is incomplete until its effect on
the usage package has been evaluated.

## Documentation

- [Architecture](../docs/architecture.md)
- [Development and operations](../docs/development.md)
- [Consumer guide](../README.md)

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../docs/README.md)
