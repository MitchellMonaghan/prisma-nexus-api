# Generator Source Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The generator package maintainers own handwritten TypeScript here. `index.ts` exposes runtime
library exports, `bin.ts` starts the Prisma generator, `_types/` owns shared configuration types,
`prismaGenerator/` owns generated declaration production, `nexusTypes/` owns runtime schema and
resolver construction, and `utils/` owns filesystem helpers.

Read [`../../../docs/components/generator-package.md`](../../../docs/components/generator-package.md).
Changes spanning generation and runtime construction require verification at both boundaries.

## Documentation

- [Documentation index](../../../docs/README.md)
