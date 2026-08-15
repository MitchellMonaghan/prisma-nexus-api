# Generator Source Instructions

[Parent instructions](../AGENTS.md)

This directory owns the published package's maintained TypeScript source.

## Contents

- [Ownership](#ownership)
- [Source rules](#source-rules)
- [Verification and documentation](#verification-and-documentation)

## Ownership

- `index.ts` owns public library exports.
- `bin.ts` owns the executable entry point.
- `_types/` owns shared and generated-contract support types.
- `nexusTypes/` owns runtime Nexus schema construction and resolvers.
- `prismaGenerator/` owns Prisma generator registration and declaration generation.
- `utils/` owns source-wide file-writing support.

## Source Rules

Treat changes to exports, generated declarations, operation names, resolver context, override
options, scalars, and event helpers as cross-boundary changes. Keep generator output and runtime
consumption aligned.

## Verification and Documentation

Run `pnpm lint`, `pnpm test`, and `pnpm build` from the package root. See
[Architecture](../../../docs/architecture.md) and
[Development and operations](../../../docs/development.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../docs/README.md)
