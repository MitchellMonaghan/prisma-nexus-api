# Generator Utility Instructions

[Parent instructions](../AGENTS.md) · [Package consumer guide](../../README.md) · [Maintainer guide](../../../../CONTRIBUTING.md)

## Contents

- [Purpose and owner](#purpose-and-owner)
- [Direct ownership](#direct-ownership)
- [Filesystem contract](#filesystem-contract)
- [Verification](#verification)

## Purpose and Owner

Generator infrastructure maintainers own shared low-level utilities used across generator
boundaries.

## Direct Ownership

- `writeFileSafely.ts` owns recursive parent-directory creation followed by synchronous file output.

## Filesystem Contract

Callers provide the exact destination and complete content. The utility creates missing parent
directories and replaces the destination file; it does not validate content, merge existing data,
provide rollback, or perform an atomic rename. Keep higher-level output selection and generation
policy with the caller.

## Verification

Test missing and existing parent directories, replacement of an existing file, exact content, and
surfacing of filesystem errors. Run generator lint, tests, and build after changes.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Human documentation](../../../../README.md)
