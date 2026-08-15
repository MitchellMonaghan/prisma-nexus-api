# Shared type instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [generator source instructions](../AGENTS.md).

## Purpose and ownership

This directory owns shared configuration and access-rule types. It directly owns `apiConfig.ts`, `genericApiConfig.ts`, `genericPropertySelector.ts`, `index.ts`, and `uniqFields.json`.

Keep exported configuration types aligned with their runtime consumers and with generated declarations. `uniqFields.json` is written by the Prisma generation path; update its generation logic rather than hand-maintaining divergent data.

Relevant documentation: [generator component](../../../../docs/components/generator.md) and the preserved [package README](../../README.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../docs/README.md)
