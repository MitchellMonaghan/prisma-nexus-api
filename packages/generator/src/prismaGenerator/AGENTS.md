# Prisma Generator Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../README.md) · [Maintainer guide](../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Generation contract](#generation-contract)
- [Verification](#verification)

## Purpose and Owner

Prisma generator maintainers own conversion of Prisma DMMF model metadata into TypeScript API
configuration declarations and unique-field lookup data.

## Direct Ownership

- `index.ts` registers the generator manifest, selects the output path, composes generated content,
  and writes `apiConfig.d.ts`.
- `genApiConfigTypes.ts` emits model fields, operation configuration, override return types, the
  top-level API configuration, and `uniqFields.json`.
- `genApiConfigAccessRules.ts` emits generic and model-specific property-selector declarations.

## Generation Contract

Generation defaults to the package's `_types` output but honors Prisma's configured generator
output. Output must be deterministic for the same DMMF and must remain compatible with the runtime
types and helper expectations. Schema IDs and unique fields are the sole source for the unique-field
lookup. Ensure output directories exist through the shared safe-write owner; do not duplicate
filesystem policy here.

## Verification

Run lint, tests, and build, then invoke `prisma generate` against representative models with IDs,
unique fields, relations, optional fields, enums, and supported scalar types. Inspect the complete
declaration for valid imports, model-specific configuration, override return types, access-rule
types, and stable output on a second run.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../README.md)
