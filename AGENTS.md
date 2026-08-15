# Repository instructions


## Contents

- [Scope and ownership](#scope-and-ownership)
- [Engineering rules](#engineering-rules)
- [Verification](#verification)
- [Change boundaries](#change-boundaries)

## Scope and ownership

These instructions cover the whole repository. This directory directly owns the workspace manifests and configuration (`package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.gitignore`, and `commitlint.config.js`) and the `.github/`, `.husky/`, `.vscode/`, `docs/`, and `packages/` trees.

Read [README.md](README.md) for the public project overview and [docs/README.md](docs/README.md) for the maintainer documentation.

## Engineering rules

- Keep solutions simple (KISS). Prefer the smallest change that satisfies the requirement.
- Avoid duplicated knowledge or implementation (DRY), but do not introduce abstractions before there is a clear shared responsibility.
- Keep modules cohesive. A file or directory should have one clear purpose and a narrow public surface.
- Refactor when existing structure makes a safe change difficult. Preserve documented and tested behavior unless the task explicitly changes it.
- Clean up temporary code, stale imports, dead branches, debugging output, and obsolete comments introduced or exposed by a change.
- Maintain documentation with behavior, commands, configuration, public exports, and directory ownership changes.
- Review every maintained handwritten file at 1,000 lines and split it when responsibilities can be separated. A maintained handwritten file must not exceed 1,200 lines; split it before merging. Generated, vendored, dependency, cache, build-output, and artifact files are outside this rule and should not be edited manually.

## Verification

Run the narrowest relevant checks, then expand when risk warrants it. Report exactly what ran and any failures. The following commands are discovered from the manifests and workflow but are unverified in this proposal:

- `pnpm install`
- `pnpm --dir packages/generator test`
- `pnpm --dir packages/generator build`
- `pnpm --dir packages/generator lint`
- `pnpm --dir packages/usage compile`

The CI workflow installs dependencies, then tests and builds `packages/generator` on its configured operating-system matrix. Do not claim a command or CI result passed without controlled execution evidence.

## Change boundaries

Preserve generated outputs and lockfiles unless the task requires regeneration. Do not edit dependency, cache, build-output, or generated-schema directories as if they were source. Follow the nearest child `AGENTS.md` for more specific ownership and verification guidance.

Repository evidence: `package.json`, `pnpm-workspace.yaml`, `packages/generator/package.json`, `packages/usage/package.json`, `.github/workflows/CI.yml`, `packages/generator/src/index.ts`, and `packages/usage/src/index.ts`.
