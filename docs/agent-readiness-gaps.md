# Agent-readiness gaps

> Parent: [Project documentation](README.md)

## Unresolved evidence gaps

- The existing root README must remain byte-for-byte, so it cannot be updated to index the proposed `docs/README.md`. The new docs index links back to it, but root-to-docs navigation remains unsatisfied without separate authorization to modify `README.md`.
- No controlled command execution was supplied. Every package, CI, migration, container, and server command is therefore documented as unverified.
- No test source files appear in the supplied inventory, although `packages/generator/package.json` declares Jest and `.github/workflows/CI.yml` invokes it. Behavioral coverage and current test outcomes are unknown.
- `.github/workflows/CI.yml` defines `matrix.node` but the setup step references `matrix.node-version`; the inventory does not prove which Node version CI actually installs or whether the workflow currently passes.
- The contents of `.github/dependabot.yml`, `.husky/commit-msg`, `.vscode/*`, `packages/usage/.docker/docker-compose.yaml`, `packages/usage/prisma/schema.prisma`, and the migration SQL were inventoried by path but not excerpted. Their exact operational contracts are intentionally not asserted.
- Transaction, retry, shutdown, migration recovery, and PubSub delivery guarantees are not established by the inventoried implementation and remain undocumented gaps.
- No nested `AGENTS.md` files are proposed for `packages/usage/prisma/migrations/` or its timestamped child because they are treated as Prisma-generated migration artifacts governed by `packages/usage/prisma/AGENTS.md`. Build output, dependency, cache, and generated Nexus output directories are likewise excluded.
