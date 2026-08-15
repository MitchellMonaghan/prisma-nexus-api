# Prisma Generator Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The generator package maintainers own Prisma generator registration and declaration generation
here. `index.ts` handles Prisma callbacks and writes `apiConfig.d.ts`;
`genApiConfigTypes.ts` creates model configuration types and the unique-field lookup;
`genApiConfigAccessRules.ts` creates schema-specific selector types.

Canonical documentation: [`../../../../docs/components/generator-package.md`](../../../../docs/components/generator-package.md)
and [`../../../../docs/features/schema-to-server.md`](../../../../docs/features/schema-to-server.md).
Verify generated output from a representative Prisma schema; do not treat checked generated output
as the only proof of generator behavior.

## Documentation

- [Documentation index](../../../../docs/README.md)
