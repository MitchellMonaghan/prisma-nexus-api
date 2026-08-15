# Shared Type Instructions

[Parent instructions](../AGENTS.md)

This directory owns shared configuration types and lookup data used by schema generation and
runtime helpers.

## Contents

- [Ownership](#ownership)
- [Constraints](#constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

- `apiConfig.ts` owns the runtime `ApiConfig` and override option shapes.
- `genericApiConfig.ts` owns generic model and operation configuration shapes.
- `genericPropertySelector.ts` owns property-selector type definitions.
- `index.ts` owns local exports.
- `uniqFields.json` is generator-maintained lookup data consumed by runtime mutation helpers.

## Constraints

Do not change a configuration field or override signature without tracing its generated counterpart
and runtime consumers. Regenerate generator-owned lookup data from the matching Prisma model rather
than editing it as an independent source of truth.

## Verification and Documentation

Run the generator package lint, test, and build commands. Update
[Architecture](../../../../docs/architecture.md) when the public or generated contract changes;
consumer usage remains canonical in the [project README](../../../../README.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../docs/README.md)
