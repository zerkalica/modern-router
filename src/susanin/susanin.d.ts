declare module 'susanin' {
    export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Defaults
    type Primitive = string | number | boolean | symbol | undefined

    export type RawParams<Params> = {
        [P in keyof Params]: Params[P] extends Primitive
            ? string
            : (Params[P] extends Primitive[] ? string[] : RawParams<Params[P]>)
    }
    
    export interface SusaninRouteConfig<
        Input = any,
        Output = any,
        Data = any,
        Defaults extends Partial<Output> | undefined = any,
        Name extends string = string,
        // Raw extends Record<keyof Params, string | string[]> = Record<keyof Params, string | string[]>
    > {
        readonly name: Name
        readonly pattern: string
        readonly defaults?: Defaults
        readonly data?: Data
        readonly conditions?: Partial<Record<keyof Input, string | string[]>>
        readonly postMatch?: (p: Input) => Output
        readonly preBuild?: (p: Output) => Input
    }

    export class Route<
        Output = any,
        Data = any,
        Defaults extends Partial<Output> | undefined = any,
        Name extends string = string
    > {
        match(url: string, data?: Partial<Data>): Output | null
        getName(): Name
        getData(): Data
        build(params: PartialDefaults<Output, Defaults>): string
    }

    export type RouteWithParams<
        Output,
        Data,
        Defaults extends Partial<Output> | undefined,
        Name extends string
    > = [Route<Output, Data, Defaults, Name>, Output]

    class Susanin {
        static Route: new <Input, Output, Data, Defaults, Name extends string>(
            config: SusaninRouteConfig<Input, Output, Data, Defaults, Name>
        ) => Route<Output, Data, Defaults, Name>

        addRoute<Input, Output, Data, Defaults extends Partial<Output> | undefined, Name extends string>(
            config: SusaninRouteConfig<Input, Output, Data, Defaults, Name>
        ): Route<Output, Data, Defaults, Name>

        findFirst<Output, Data, Defaults extends Partial<Output> | undefined, Name extends string>(
            url: string,
            data?: Partial<Data>
        ): RouteWithParams<Output, Data, Defaults, Name> | null
    }

    export default Susanin
}
