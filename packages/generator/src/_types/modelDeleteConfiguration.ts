export type AfterResolverMiddleware = (root: any, args: any, ctx: any, info: any) => boolean

export type ModelDeleteConfiguration = {
    disableAll?: boolean
    disableDeleteOne?: boolean
    disableDeleteMany?: boolean
    beforeDeleteOne?: AfterResolverMiddleware
    beforeDeleteMany?: AfterResolverMiddleware
}
