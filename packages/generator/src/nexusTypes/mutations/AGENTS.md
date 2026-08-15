# Mutation instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [Nexus runtime instructions](../AGENTS.md).

## Purpose and ownership

This directory owns generated Nexus mutation fields and default Prisma mutation helpers. It directly owns `createOne.ts`, `updateOne.ts`, `updateMany.ts`, `upsertOne.ts`, `deleteOne.ts`, `deleteMany.ts`, and `index.ts`.

Keep operation names, Prisma operation identifiers, model-level overrides, all-model overrides, return types, and notification payloads aligned. Overrides replace the default Prisma helper call, so preserve that precedence deliberately. Document changes to events or override contracts in [the generator component guide](../../../../../docs/components/generator.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../../docs/README.md)
