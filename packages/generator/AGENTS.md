# Generator package instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [package instructions](../AGENTS.md) and [root instructions](../../AGENTS.md).

## Purpose and ownership

This directory owns the publishable `prisma-nexus-api` package. It directly owns `package.json`, `tsconfig.json`, `.eslintrc.js`, `.gitignore`, `jest.config.js`, the preserved `README.md`, and the `src/` implementation.

Maintain compatibility between the package entry points, CLI mapping, TypeScript output, public exports, and Prisma generator manifest. Public behavior is described in [README.md](README.md) and [the generator component guide](../../docs/components/generator.md).

Discovered but unverified checks:

- `pnpm test`
- `pnpm build`
- `pnpm lint`

The CI workflow provides command configuration but no passing-run evidence in this inventory.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../docs/README.md)
