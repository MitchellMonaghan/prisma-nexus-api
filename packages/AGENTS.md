# Package workspace instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [root instructions](../AGENTS.md).

## Purpose and ownership

This directory contains the maintained workspace projects. It directly owns the `generator/` package and the `usage/` example application.

Keep package boundaries clear: reusable generator and runtime behavior belongs in `generator/`; example integration and infrastructure belong in `usage/`. Coordinate public API changes with both projects and with [the component documentation](../docs/components/README.md).

Workspace membership is defined by `pnpm-workspace.yaml`.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../docs/README.md)
