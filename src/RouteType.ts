import { Tokens, Validator } from './schema'

export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Partial<Defaults>

type UnionOf<T> = T[keyof T]

export type RawParams<Params> = Record<keyof Params, string | string[]>

export type RouteConfig<
    Params = any,
    Data = any,
    Defaults = Partial<Params>,
    Context = any,
    Raw extends RawParams<Params> = RawParams<Params>
> = {
    readonly validate: Validator<Params>
    readonly defaults?: Defaults
    readonly data?: Data
    pattern(p: Tokens<Params>): string
    postMatch?: (p: Raw, context: Context) => Params
    preBuild?: (p: Params, context: Context) => Raw
}

export type AllRoutesConfig<K extends {} = any> = {
    [P in keyof K]: P extends string ? (K[P] extends RouteConfig ? K[P] : never) : never
}

export interface Route<
    Params = any,
    Data = any,
    Defaults extends Partial<Params> = any,
    Name extends string = string
> {
    readonly name: Name
    readonly params: Params

    push(params: PartialDefaults<Params, Defaults>): void
    replace(params: PartialDefaults<Params, Defaults>): void
    url(params: PartialDefaults<Params, Defaults>): string
}

export type RouteConfigToRoute<Config, Name extends string> = Config extends RouteConfig<
    infer Params,
    infer Data,
    infer Defaults
>
    ? Route<Params, Data, Defaults, Name>
    : never

export type AllRoutes<Config extends AllRoutesConfig> = {
    [Name in keyof Config]: Name extends string
        ? (Config[Name] extends RouteConfig ? RouteConfigToRoute<Config[Name], Name> : never)
        : never
} & { current: CurrentRoute<Config> }

export type CurrentRoute<Config> = Omit<UnionOf<AllRoutes<Config>>, 'params'>
