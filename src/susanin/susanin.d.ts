declare module 'susanin' {
    export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Partial<Defaults>

    export interface SusaninRouteConfig<
        Params extends {} = any,
        Data extends {} = any,
        Defaults extends Partial<Params> = any,
        Name extends string = string,
        Raw extends Record<keyof Params, string | string[]> = Record<keyof Params, string | string[]>
    > {
        readonly name: Name
        readonly pattern: string
        readonly defaults?: Defaults
        readonly data?: Data
        readonly conditions?: Partial<Record<keyof Params, string | string[]>>
        readonly postMatch?: (p: Raw) => Params
        readonly preBuild?: (p: Params) => Raw
    }

    export class Route<
        Params extends {} = {},
        Data extends {} = any,
        Defaults extends Partial<Params> = Partial<Params>,
        Name extends string = string
    > {
        match(url: string, data?: Partial<Data>): Params | null
        getName(): Name
        getData(): Data
        build(params: PartialDefaults<Params, Defaults>): string
    }

    export type RouteWithParams<
        Params extends {},
        Data extends {},
        Defaults extends Partial<Params>,
        Name extends string
    > = [Route<Params, Data, Defaults, Name>, Params]

    class Susanin {
        addRoute<Params extends {}, Data extends {}, Defaults extends Partial<Params>, Name extends string>(
            config: SusaninRouteConfig<Params, Data, Defaults, Name>
        ): Route<Params, Data, Defaults, Name>

        findFirst<Params extends {}, Data extends {}, Defaults extends Partial<Params>, Name extends string>(
            url: string,
            data?: Partial<Data>
        ): RouteWithParams<Params, Data, Defaults, Name> | null
    }

    export default Susanin
}