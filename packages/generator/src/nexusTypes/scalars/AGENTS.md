# Scalar instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [Nexus runtime instructions](../AGENTS.md).

## Purpose and ownership

This directory owns Nexus adapters for Prisma-related GraphQL scalars. It directly owns `BigInt.ts`, `Bytes.ts`, `DateTime.ts`, `Decimal.ts`, `Json.ts`, and `index.ts`.

Keep GraphQL names compatible with generated Prisma types and keep `ExcludeScalar` synchronized with the scalar registry. Add or remove a scalar through the registry and public settings together.

Relevant documentation: [generator component](../../../../../docs/components/generator.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../../docs/README.md)
