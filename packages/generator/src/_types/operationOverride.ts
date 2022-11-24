export type OperationOverride<T> = (prismaParams: any, ctx: any) => Promise<T>
