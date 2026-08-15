# Workflow Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own CI workflow files here. `.github/workflows/CI.yml` installs with
pnpm and runs the generator package's Jest and TypeScript build scripts across its configured OS
matrix.

Relevant documentation: [`../../docs/components/generator-package.md`](../../docs/components/generator-package.md).
Treat workflow commands as verification only after the controlled run reports success; keep the
workflow consistent with `packages/generator/package.json`.

## Documentation

- [Documentation index](../../docs/README.md)
