# Prisma generator instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [generator source instructions](../AGENTS.md).

## Purpose and ownership

This directory owns Prisma generator registration and generated API configuration declarations. It directly owns `index.ts`, `genApiConfigTypes.ts`, and `genApiConfigAccessRules.ts`.

Treat emitted declaration shape, output-path selection, unique-field collection, and source-template reads as one contract. Generated files must be changed through these generators when possible. Do not claim `prisma generate` succeeds unless it was run against a usable schema.

Relevant documentation: [generator component](../../../../docs/components/generator.md) and [schema-to-API flow](../../../../docs/features/schema-to-api.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../docs/README.md)
