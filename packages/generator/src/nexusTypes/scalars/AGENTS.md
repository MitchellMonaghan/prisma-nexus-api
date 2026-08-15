# Scalar Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../../README.md) · [Maintainer guide](../../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Scalar contract](#scalar-contract)
- [Verification](#verification)

## Purpose and Owner

Scalar maintainers own the Nexus adapters for Prisma-compatible GraphQL scalar values.

## Direct Ownership

- `BigInt.ts`, `Bytes.ts`, `DateTime.ts`, `Decimal.ts`, and `Json.ts` own scalar serialization and
  Nexus method registration.
- `index.ts` owns the default scalar registry, exclusion type, and filtering behavior.

## Scalar Contract

Keep GraphQL names compatible with the Prisma schema types and Nexus method names. Decimal input
accepts integer, float, and string literals and serializes as a string. Exclusions remove only the
named default scalars and must remain reflected in the exported exclusion type.

## Verification

Run generator lint, tests, and build. For changed scalars, test serialization, variable parsing,
literal parsing, invalid input, GraphQL type names, Nexus method registration, and exclusion from
the returned scalar list.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../README.md)
