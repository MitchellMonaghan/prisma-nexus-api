# Generator Utility Instructions

[Parent instructions](../AGENTS.md)

This directory owns source-wide utilities that do not belong to the Prisma or Nexus domain
boundaries.

## Contents

- [Ownership](#ownership)
- [Constraints](#constraints)
- [Verification and documentation](#verification-and-documentation)

## Ownership

`writeFileSafely.ts` owns recursive parent-directory creation and synchronous file replacement for
generator output.

## Constraints

Callers must resolve and validate their target path and content before invoking the writer. Changes
here affect every generated file write and require verification of directory creation, replacement,
and surfaced failures.

## Verification and Documentation

Run package lint, tests, and build, plus a representative generator run for behavioral changes. See
[Architecture](../../../../docs/architecture.md) and
[Development and operations](../../../../docs/development.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../docs/README.md)
