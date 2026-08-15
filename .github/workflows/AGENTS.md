# Workflow instructions


## Contents

- [Purpose and ownership](#purpose-and-ownership)
- [Documentation](#documentation)

Follow the [GitHub configuration instructions](../AGENTS.md) and [root instructions](../../AGENTS.md).

## Purpose and ownership

This directory owns GitHub Actions workflow files. It directly owns `CI.yml`.

Keep job matrices, setup inputs, working directories, and package commands internally consistent. When package scripts change, update affected workflows and documentation together. Validate workflow syntax and report whether validation or execution actually ran.

The commands in `CI.yml` are repository evidence, not proof of a passing run.

> Parent: [Parent instructions](../AGENTS.md)

## Documentation

- [Documentation index](../../docs/README.md)
