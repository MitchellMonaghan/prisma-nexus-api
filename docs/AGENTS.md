# Documentation Instructions

> Parent: [Documentation index](README.md)

[Parent instructions](../AGENTS.md)

This directory owns durable maintainer documentation that complements the consumer-facing root and
package READMEs.

## Contents

- [Ownership](#ownership)
- [Documentation rules](#documentation-rules)
- [Verification](#verification)

## Ownership

- `README.md` is the maintainer documentation index.
- `architecture.md` owns system boundaries, data flow, generated outputs, and compatibility.
- `development.md` owns setup, stateful workflows, side effects, recovery, and verification.

## Documentation Rules

Keep consumer API instructions canonical in [the root README](../README.md). Maintain one owner per
subject, keep the index synchronized with its direct children, and link across documents instead of
duplicating contracts.

## Verification

Check relative links, anchors, command spelling, and every behavior claim against the owning package
manifest or source boundary. Documentation-only edits do not require application tests.


## Documentation
