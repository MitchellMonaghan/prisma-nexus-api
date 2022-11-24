import { ApiConfig } from './apiConfig'

export type OperationOverrideOptions<ParamsType, ContextType> = {
    modelName:string
    prismaOperation:string
    prismaParams: ParamsType
    ctx: ContextType
    apiConfig: ApiConfig
}

export type OperationOverride<T> = (options: OperationOverrideOptions<any, any>) => Promise<T>
