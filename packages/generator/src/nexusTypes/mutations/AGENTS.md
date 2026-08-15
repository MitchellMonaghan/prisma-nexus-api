# Mutation Instructions

Parent: [`../AGENTS.md`](../AGENTS.md)

The generator package maintainers own generated mutation fields and default mutation helpers here.
`createOne.ts`, `updateOne.ts`, `updateMany.ts`, `upsertOne.ts`, `deleteOne.ts`, and `deleteMany.ts`
own their corresponding Prisma operation, override precedence, result shape, and optional PubSub
notification; `index.ts` exports them.

Canonical documentation: [`../../../../../docs/components/generator-package.md`](../../../../../docs/components/generator-package.md).
Mutation changes must verify database effects, selected return fields, override behavior, event
payloads, and failure behavior. Multi-call helpers require composed testing at the Prisma boundary.

## Documentation

- [Documentation index](../../../../../docs/README.md)
