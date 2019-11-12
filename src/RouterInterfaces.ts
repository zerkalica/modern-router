export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> &
    Defaults

type UnionOf<T> = T[keyof T]

type Primitive = string | number | boolean | symbol | undefined

export type Tokens<Params> = {
    [P in keyof Params]-?: Params[P] extends Primitive
        ? string
        : Params[P] extends any[]
        ? never
        : Tokens<Params[P]>
}

export interface RouteType<
    Output = any,
    Defaults = any,
    Context = any
> {
    readonly defaults?: Defaults
    toUrl(params: PartialDefaults<Output, Defaults>, context?: Context): string
    fromUrl(url: string, context?: Context): Output
}

export type AllRouteTypes<RouteTypes = any> = {
    [P in keyof RouteTypes]: RouteTypes[P] extends RouteType ? RouteTypes[P] : never
}

export type PickContext<RouteTypes = any> = UnionOf<{
    [P in keyof RouteTypes]: RouteTypes[P] extends RouteType<any, any, infer Context> ? Context : never
}>

export interface IRoute<
    Output = any,
    Defaults = any,
    Name extends string = any
> {
    readonly name: Name
    readonly params: Output

    push(params: PartialDefaults<Output, Defaults>): void
    replace(params: PartialDefaults<Output, Defaults>): void
    url(params: PartialDefaults<Output, Defaults>): string
}

export type AllRoutes<Config extends AllRouteTypes> = {
    [Name in keyof Config]: Name extends string
        ? Config[Name] extends RouteType<infer Output, infer Defaults>
            ? IRoute<Output, Defaults, Name>
            : never
        : never
}

export type CurrentRoute<Config> = UnionOf<AllRoutes<Config>>
