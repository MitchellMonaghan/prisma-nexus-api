# Scalar Instructions

[Parent instructions](../AGENTS.md)

This directory owns the custom GraphQL scalar implementations included in generated Nexus schemas.

## Contents

- [Ownership](#ownership)
- [Scalar constraints](#scalar-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

The named scalar files own `BigInt`, `Bytes`, `DateTime`, `Decimal`, and `Json` behavior.
`index.ts` owns the default scalar set and exclusion contract.

## Scalar Constraints

Preserve GraphQL scalar names and Nexus method names expected by Prisma-derived schemas. Changes to
serialization or parsing are public data-contract changes and require valid, invalid, and round-trip
coverage.

## Verification and Documentation

Run package lint, tests, and build. Update [Architecture](../../../../../docs/architecture.md) and
consumer documentation when supported scalar behavior changes.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../../docs/README.md)
