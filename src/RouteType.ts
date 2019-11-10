import { Validator } from './schema'

export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Defaults

type UnionOf<T> = T[keyof T]

type Primitive = string | number | boolean | symbol | undefined

export type RawParams<Params> = {
    [P in keyof Params]: Params[P] extends Primitive
        ? string
        : (Params[P] extends Primitive[] ? string[] : RawParams<Params[P]>)
}

export type Tokens<Params> = {
    [P in keyof Params]-?: Params[P] extends Primitive
        ? string
        : (Params[P] extends any[] ? never : Tokens<Params[P]>)
}

export type RouteConfig<
    Params = any,
    Data = any,
    Defaults extends Partial<Params> | undefined = any,
    Context = any
    // Raw extends RawParams<Params> = RawParams<Params>
> = {
    readonly validate: Validator<Params>
    readonly defaults?: Defaults
    readonly data?: Data
    pattern(p: Tokens<Params>): string
    postMatch?: (p: RawParams<Params>, context: Context) => Params
    preBuild?: (p: Params, context: Context) => RawParams<Params>
}

export type AllRoutesConfig<K = any> = {
    [P in keyof K]: P extends 'current' ? never : (K[P] extends RouteConfig ? K[P] : never)
}

export interface Route<
    Params = any,
    Data = any,
    Defaults extends Partial<Params> | undefined = undefined,
    Name = any
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

export type AllRoutes<Config> = {
    [Name in keyof Config]: Name extends string
        ? (Config[Name] extends RouteConfig ? RouteConfigToRoute<Config[Name], Name> : never)
        : never
} & { current: CurrentRoute<Config> }

export type CurrentRoute<Config> = Omit<UnionOf<Omit<AllRoutes<Config>, 'current'>>, 'params'>
