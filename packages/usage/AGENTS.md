# Usage Application Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own the private example application here. `src/` owns Apollo and Nexus
startup, `prisma/` owns the example data model and migration history, `.docker/` owns local service
orchestration, and `package.json`, `tsconfig.json`, and `.eslintrc.js` own package workflows and
tooling.

Canonical documentation: [`../../docs/components/usage-application.md`](../../docs/components/usage-application.md)
and [`../../docs/features/schema-to-server.md`](../../docs/features/schema-to-server.md).
Commands in `package.json` are unverified. `dev`, `start`, and `migrate` can generate files or alter
the configured database, so inspect configuration before running them.

## Documentation

- [Documentation index](../../docs/README.md)
