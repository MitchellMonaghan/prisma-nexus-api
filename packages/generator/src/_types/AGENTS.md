# Generator Type Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../README.md) · [Maintainer guide](../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Local contract](#local-contract)
- [Verification](#verification)

## Purpose and Owner

Generator package maintainers own the generic TypeScript contracts used by generation and runtime
schema construction.

## Direct Ownership

- `apiConfig.ts` owns the generic API configuration and override signatures.
- `genericApiConfig.ts` owns model and operation configuration shapes.
- `genericPropertySelector.ts` owns property-selector and logical-operator types.
- `index.ts` owns local type exports.
- `uniqFields.json` stores generator-derived ID and unique-field lookup data.

## Local Contract

Treat exported types as public compatibility contracts. Keep generic contracts aligned with the
model-specific declarations emitted by the Prisma generator. `uniqFields.json` is refreshed from
Prisma model metadata by generation; change its producer instead of hand-maintaining divergent
data.

## Verification

Run generator lint, tests, and build. For configuration or unique-field changes, run Prisma
generation against a representative schema and compare the emitted declarations and lookup data to
the schema contract.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../README.md)
