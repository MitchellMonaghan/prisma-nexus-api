# Prisma Generator Instructions

[Parent instructions](../AGENTS.md)

This directory owns Prisma generator registration and generation of schema-specific API
configuration declarations.

## Contents

- [Ownership](#ownership)
- [Generation constraints](#generation-constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

- `index.ts` owns the generator manifest, output selection, and assembled declaration write.
- `genApiConfigTypes.ts` owns model field, operation, configuration, and unique-field generation.
- `genApiConfigAccessRules.ts` owns generated Prisma imports and access-rule declarations.

## Generation Constraints

Treat the Prisma DMMF as the generation input. Keep emitted imports, model names, field unions,
override result types, `ApiConfig`, and unique-field data synchronized. Generation may create
parent directories and overwrite its target file, so use disposable fixtures when testing output.

## Verification and Documentation

Run package lint, tests, and build, then run `prisma generate` against a representative schema when
output changes. Review the generated declaration rather than relying on compilation alone. See
[Architecture](../../../../docs/architecture.md) and
[Development and operations](../../../../docs/development.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../docs/README.md)
