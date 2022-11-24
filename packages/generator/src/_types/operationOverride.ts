export type OperationOverride<T> = (modelName:string, prismaParams: any, ctx: any) => Promise<T>
