# Example Prisma Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own the example database contract here. `schema.prisma` owns the current
Prisma schema. `migrations/` contains Prisma migration history, including
`migrations/20230629190044_init/migration.sql` and `migrations/migration_lock.toml`; treat that
subtree as migration artifacts governed here rather than adding nested instruction files.

Canonical documentation: [`../../../docs/components/usage-application.md`](../../../docs/components/usage-application.md)
and [`../../../docs/features/schema-to-server.md`](../../../docs/features/schema-to-server.md).
Schema changes must account for generated client/configuration output and database migration side
effects. The discovered `pnpm migrate` command is unverified.

## Documentation

- [Documentation index](../../../docs/README.md)
