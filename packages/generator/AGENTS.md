# Generator Package Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](README.md) · [Maintainer guide](../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Local contract](#local-contract)
- [Commands](#commands)

## Purpose and Owner

Generator package maintainers own the publishable `prisma-nexus-api` package and its public CLI and
library contracts.

## Direct Ownership

- `src/` owns handwritten TypeScript for the Prisma generator and runtime Nexus integration.
- `package.json` owns package metadata, exports, dependencies, engine support, and scripts.
- `README.md` is the canonical package-local consumer guide.
- `.eslintrc.js`, `jest.config.js`, and `tsconfig.json` own lint, test, and compilation behavior.
- `.gitignore` owns package-local ignore rules.

## Local Contract

Preserve the CLI at `dist/bin.js`, library declarations at `dist/index.d.ts`, and Node.js 16-or-newer
engine boundary unless a deliberate compatibility change updates package metadata and documentation.
Changes to exported configuration, generated schema behavior, resolver overrides, helper events, or
scalars are public-contract changes and must be reflected in the canonical consumer documentation.
Do not edit compiled output as source.

## Commands

Run `pnpm build`, `pnpm lint`, and `pnpm test` from this directory. `pnpm dev` runs the TypeScript
watcher. Before packaging, the `prepack` and `prepare` scripts compile TypeScript, so a package change
is incomplete if the normal build fails.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../README.md)
