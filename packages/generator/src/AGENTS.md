# Generator source instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [generator package instructions](../AGENTS.md).

## Purpose and ownership

This directory owns handwritten TypeScript for package entry points, Prisma type generation, Nexus runtime types, shared types, and file utilities. It directly owns `bin.ts`, `index.ts`, and the `_types/`, `nexusTypes/`, `prismaGenerator/`, and `utils/` children.

Keep `index.ts` exports intentional and `bin.ts` limited to starting the Prisma generator. Changes crossing generation and runtime boundaries must update [the generator component guide](../../../docs/components/generator.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../docs/README.md)
