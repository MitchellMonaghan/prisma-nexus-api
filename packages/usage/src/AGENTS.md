# Usage Source Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own the example application's handwritten runtime source here.
`index.ts` creates Prisma and Apollo clients, builds Nexus types, applies PrismaSelect middleware,
provides request context, and starts the standalone server. Generated Nexus schema and typegen
output beneath `src/generated/` are build artifacts governed here and must not receive instruction
files.

Canonical documentation: [`../../../docs/components/usage-application.md`](../../../docs/components/usage-application.md)
and [`../../../docs/features/schema-to-server.md`](../../../docs/features/schema-to-server.md).
Verify startup changes against schema construction, middleware context, database connectivity, and
server readiness.

## Documentation

- [Documentation index](../../../docs/README.md)
