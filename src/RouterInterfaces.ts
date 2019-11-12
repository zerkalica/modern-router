import { Validator, RecMetadata } from './schema'

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
    Input = any,
    Output = any,
    Data = any,
    Defaults extends Partial<Output> | undefined = any,
> = {
    readonly input?: Validator<Input>
    // readonly output: Validator<Output>
    readonly defaults?: Defaults
    readonly data?: Data
    readonly conditions?: Partial<Record<keyof Input, string | string[]>>
    pattern(p: Tokens<Input>): string
    toQuery: (p: Output) => Input
    fromQuery: ((p: Input) => Output) & RecMetadata
}

export type AllRoutesConfig<K = any> = {
    [P in keyof K]: P extends 'current' ? never : (K[P] extends RouteConfig ? K[P] : never)
}

export interface Route<
    Output = any,
    Data = any,
    Defaults extends Partial<Output> | undefined = undefined,
    Name = any
> {
    readonly name: Name
    readonly params: Output

    push(params: PartialDefaults<Output, Defaults>): void
    replace(params: PartialDefaults<Output, Defaults>): void
    url(params: PartialDefaults<Output, Defaults>): string
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
        ? (Config[Name] extends RouteConfig ? Omit<RouteConfigToRoute<Config[Name], Name>, 'params'> : never)
        : never
} & { current: CurrentRoute<Config> }

export type AllRoutesS<Config> = {
    [Name in keyof Config]: Name extends string
        ? (Config[Name] extends RouteConfig ? RouteConfigToRoute<Config[Name], Name> : never)
        : never
}

export type CurrentRoute<Config> = UnionOf<AllRoutesS<Config>>
