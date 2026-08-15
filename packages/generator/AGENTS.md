# Generator Package Instructions

[Parent instructions](../AGENTS.md)

This directory owns the published `prisma-nexus-api` library, command-line Prisma generator, build
configuration, lint configuration, and Jest configuration.

## Contents

- [Ownership](#ownership)
- [Commands](#commands)
- [Constraints](#constraints)
- [Documentation](#documentation)

## Ownership

- `src/` owns all maintained TypeScript implementation and has local instructions.
- `package.json` owns package exports, binaries, dependencies, scripts, engine support, and release
  metadata.
- `tsconfig.json`, `.eslintrc.js`, and `jest.config.js` own compile, lint, and test configuration.
- `README.md` is the unchanged package-local consumer guide.

Generated `dist/`, dependency, and cache directories inherit these instructions.

## Commands

```sh
pnpm build
pnpm lint
pnpm test
```

Run commands from this directory. `prepack` and `prepare` also compile TypeScript.

## Constraints

Preserve the public entry point, CLI binary, generated declaration contract, GraphQL names,
overrides, and notification helpers unless the task explicitly changes compatibility. Verify
package consumers when changing Prisma, Nexus, GraphQL, or generated-type boundaries.

## Documentation

- [Consumer guide](README.md)
- [Architecture](../../docs/architecture.md)
- [Development and operations](../../docs/development.md)

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../docs/README.md)
