export type BeforeOperationMiddleware = (root: any, args: any, ctx: any, info: any) => Promise<boolean>
export type AfterOperationMiddleware = (root: any, args: any, ctx: any, info: any) => Promise<void>
