# Nexus runtime instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [generator source instructions](../AGENTS.md).

## Purpose and ownership

This directory owns runtime conversion of Prisma DMMF data into Nexus types and operations. It directly owns `index.ts`, `utils.ts`, and the `mutations/`, `queries/`, and `scalars/` children.

Preserve the order and interaction of enum, input, output, model, operation, batch-payload, and scalar construction. Keep configuration filtering consistent across generated fields and operation registration. Update [the generator component guide](../../../../docs/components/generator.md) when runtime behavior changes.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../../../docs/README.md)
