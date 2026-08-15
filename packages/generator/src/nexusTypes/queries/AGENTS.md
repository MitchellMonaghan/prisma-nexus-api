# Query instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [Nexus runtime instructions](../AGENTS.md).

## Purpose and ownership

This directory owns Nexus query fields backed by Prisma reads. It directly owns `aggregate.ts`, `findCount.ts`, `findFirst.ts`, `findMany.ts`, `findUnique.ts`, and `index.ts`.

Keep query names, argument lookup, result nullability, Prisma operation identifiers, and override precedence consistent. Context selection data is merged into Prisma parameters by these resolvers; coordinate changes with the usage middleware example.

Relevant documentation: [generator component](../../../../../docs/components/generator.md) and [usage application](../../../../../docs/components/usage-application.md).

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../../docs/README.md)
