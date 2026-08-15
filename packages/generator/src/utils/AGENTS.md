# Generator Utility Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The generator package maintainers own narrowly shared utilities here. `writeFileSafely.ts` creates a
parent directory recursively and writes generated content to the requested path.

Canonical documentation: [`../../../../docs/components/generator-package.md`](../../../../docs/components/generator-package.md).
Filesystem changes must verify the resolved destination, directory creation, replacement behavior,
and propagated write failures.

## Documentation

- [Documentation index](../../../../docs/README.md)
