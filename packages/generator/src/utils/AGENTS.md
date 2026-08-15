# Generator utility instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [generator source instructions](../AGENTS.md).

## Purpose and ownership

This directory owns general generator-side utilities. It directly owns `writeFileSafely.ts`.

Keep filesystem helpers small and explicit about parent-directory creation and overwrite behavior. Review every caller before changing write semantics.

Relevant documentation: [generator component](../../../../docs/components/generator.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../docs/README.md)
