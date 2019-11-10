declare module 'susanin' {
    export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Defaults
    export type RawParams<Params> = Record<keyof Params, string | string[]>

    export interface SusaninRouteConfig<
        Params = any,
        Data = any,
        Defaults extends Partial<Params> | undefined = any,
        Name extends string = string,
        // Raw extends Record<keyof Params, string | string[]> = Record<keyof Params, string | string[]>
    > {
        readonly name: Name
        readonly pattern: string
        readonly defaults?: Defaults
        readonly data?: Data
        readonly conditions?: Partial<Record<keyof Params, string | string[]>>
        readonly postMatch?: (p: RawParams<Params>) => Params
        readonly preBuild?: (p: Params) => RawParams<Params>
    }

    export class Route<
        Params = any,
        Data = any,
        Defaults extends Partial<Params> | undefined = any,
        Name extends string = string
    > {
        match(url: string, data?: Partial<Data>): Params | null
        getName(): Name
        getData(): Data
        build(params: PartialDefaults<Params, Defaults>): string
    }

    export type RouteWithParams<
        Params,
        Data,
        Defaults extends Partial<Params> | undefined,
        Name extends string
    > = [Route<Params, Data, Defaults, Name>, Params]

    class Susanin {
        addRoute<Params, Data, Defaults extends Partial<Params> | undefined, Name extends string>(
            config: SusaninRouteConfig<Params, Data, Defaults, Name>
        ): Route<Params, Data, Defaults, Name>

        findFirst<Params, Data, Defaults extends Partial<Params> | undefined, Name extends string>(
            url: string,
            data?: Partial<Data>
        ): RouteWithParams<Params, Data, Defaults, Name> | null
    }

    export default Susanin
}
