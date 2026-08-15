# GitHub configuration instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [root instructions](../AGENTS.md).

## Purpose and ownership

This directory owns repository-hosting automation. It directly owns `dependabot.yml` and the `workflows/` child directory.

Keep dependency-update configuration and workflow behavior consistent with the workspace manifests. Treat action versions, runtime matrices, permissions, caches, and triggers as operational behavior requiring review.

Relevant references: [CI workflow](workflows/CI.yml), root `package.json`, and `pnpm-lock.yaml`.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../docs/README.md)
