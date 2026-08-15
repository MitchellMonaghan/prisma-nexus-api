# Usage application instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [package instructions](../AGENTS.md) and [root instructions](../../AGENTS.md).

## Purpose and ownership

This directory owns the private example application demonstrating `prisma-nexus-api`. It directly owns `package.json`, `tsconfig.json`, `.eslintrc.js`, `.gitignore`, and the `.docker/`, `prisma/`, and `src/` children.

Keep the example aligned with the generator package's public exports and middleware expectations. Infrastructure and migrations support the example and are not package-library concerns.

Discovered but unverified commands:

- `pnpm dev`
- `pnpm compile`
- `pnpm start`
- `pnpm migrate`
- `pnpm dockerCompose`

See [the usage component guide](../../docs/components/usage-application.md) and [the end-to-end flow](../../docs/features/schema-to-api.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../docs/README.md)
