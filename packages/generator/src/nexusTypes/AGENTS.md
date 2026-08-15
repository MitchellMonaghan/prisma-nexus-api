# Nexus Type Construction Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The generator package maintainers own conversion of Prisma DMMF data into Nexus definitions here.
`index.ts` builds enums, inputs, outputs, models, operations, batch payloads, and scalars; `utils.ts`
owns argument and configuration helpers. `queries/`, `mutations/`, and `scalars/` own their named
GraphQL boundaries.

Canonical documentation: [`../../../../docs/components/generator-package.md`](../../../../docs/components/generator-package.md)
and [`../../../../docs/features/schema-to-server.md`](../../../../docs/features/schema-to-server.md).
Verify filtering changes against global and per-model configuration and the resulting schema.

## Documentation

- [Documentation index](../../../../docs/README.md)
