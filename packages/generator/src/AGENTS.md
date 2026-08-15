# Generator Source Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../README.md) · [Maintainer guide](../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Local contract](#local-contract)
- [Verification](#verification)

## Purpose and Owner

Generator package maintainers own the handwritten TypeScript implementation in this directory.

## Direct Ownership

- `bin.ts` is the executable entry point that registers the Prisma generator.
- `index.ts` is the public library export boundary.
- `_types/` owns generic API contracts and generator-maintained unique-field data.
- `prismaGenerator/` owns Prisma generation and declaration output.
- `nexusTypes/` owns runtime Nexus type construction, resolvers, and helper exports.
- `utils/` owns shared filesystem output support.

## Local Contract

Keep CLI registration, build-time generation, and runtime schema construction as distinct
responsibilities. Public exports must remain intentional. When moving a responsibility, update the
nearest child index and all affected import or export boundaries.

## Verification

Run the package lint, test, and build scripts. Changes crossing generation and runtime boundaries
also require a representative `prisma generate` run and runtime schema construction against the
same schema.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../README.md)
