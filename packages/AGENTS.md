# Package Workspace Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The repository maintainers own the pnpm workspace packages here. `packages/generator/` is the
published library and CLI; `packages/usage/` is the private example application that consumes it
through `workspace:*`.

Read [`../docs/components/README.md`](../docs/components/README.md) and the nearest package
instructions before editing. Keep shared package relationships consistent with
`pnpm-workspace.yaml`, the lockfile, and both package manifests.

## Documentation

- [Documentation index](../docs/README.md)
