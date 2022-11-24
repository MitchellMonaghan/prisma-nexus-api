export type OperationOverrideOptions<T> = {
    modelName:string
    prismaOperation:string
    prismaParams: T
    ctx: any
}

export type OperationOverride<T> = (options: OperationOverrideOptions<any>) => Promise<T>
