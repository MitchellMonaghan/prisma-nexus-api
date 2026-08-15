# Packages Instructions

[Parent instructions](../AGENTS.md) · [Project overview](../README.md) · [Maintainer guide](../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Local contract](#local-contract)
- [Verification](#verification)

## Purpose and Owner

Repository package maintainers own this pnpm workspace boundary. It groups the publishable generator
and the private composed usage example.

## Direct Ownership

- `generator/` owns the `prisma-nexus-api` package, Prisma generator, runtime Nexus type creation,
  and package tests.
- `usage/` owns the private Apollo/Prisma example and its local database workflow.

## Local Contract

Keep package responsibilities separate. The usage package must consume the generator through its
`workspace:*` dependency so integration work exercises the local package. Package-specific scripts,
generated outputs, and stateful effects belong in the nearest child instructions.

## Verification

Install dependencies from the repository root. Verify each changed package with its native scripts;
changes to their shared contract require both generator checks and a representative usage-package
integration run.

> Parent: [Parent instructions](../AGENTS.md)
