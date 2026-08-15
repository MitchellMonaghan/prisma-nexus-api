# Agent-readiness gaps

> Parent: [Project documentation](README.md)

## Unresolved evidence gaps

- No existing AGENTS.md or other agent-instruction file was inventoried, so the proposed engineering and file-size rules are new policy required by the preparation request rather than discovered repository behavior.
- The inventory supplies CI configuration but no controlled CI or local execution result. All install, test, build, lint, compile, generation, migration, container, and server commands therefore remain unverified.
- The CI workflow references `matrix.node-version` while its matrix declares `node`; the proposal does not claim the configured Node matrix is effective or that CI passes.
- No test source files were inventoried even though the generator manifest and Jest configuration define a test command. Test coverage and current test behavior are unknown.
- The usage source explicitly leaves Express and WebSocket/subscription setup as a TODO. Subscription transport must not be described as implemented.
- Database availability, Docker Compose behavior, migration application, generated example outputs, and a successful GraphQL request were not demonstrated by controlled execution.
- `packages/generator/src/_types/uniqFields.json` is written by generation code, but the inventory does not establish whether its checked-in contents are current for any particular schema.
