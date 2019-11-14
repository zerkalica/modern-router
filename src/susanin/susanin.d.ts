declare module 'susanin' {
    export type PartialDefaults<Params, Defaults> =
        Omit<Params, keyof Defaults> & Partial<Pick<Params, keyof Params & keyof Defaults>>;

    type Primitive = string | number | boolean | symbol | undefined

    export type RawParams<Params> = {
        [P in keyof Params]: Params[P] extends Primitive
            ? string
            : (Params[P] extends Primitive[] ? string[] : RawParams<Params[P]>)
    }

    export type RouteConditions<Input> = Partial<Record<keyof Input, string | readonly string[]>>

    export interface SusaninRouteConfig<
        Input,
        Output,
        Defaults,
        Name extends string,
        Data,
    > {
        readonly name: Name;
        readonly pattern: string;
        readonly defaults?: Defaults;
        readonly data?: Data;
        readonly conditions?: RouteConditions<Input>;
        readonly postMatch?: (p: Input) => Output;
        readonly preBuild?: (p: Output) => Input;
    }

    export class SusaninRouteBase<
        Output,
        Defaults,
        Name extends string,
        Data,
    > {
        match(url: string, data?: Partial<Data>): Output | null
        getName(): Name
        getData(): Data
        build(params: PartialDefaults<Output, Defaults>): string
    }

    export type RouteWithParams<
        Output,
        Defaults,
        Name extends string,
        Data,
    > = [SusaninRouteBase<Output, Defaults, Name, Data>, Output]

    class Susanin {
        static Route: new <Input, Output, Defaults, Name extends string, Data>(
            config: SusaninRouteConfig<Input, Output, Defaults, Name, Data>
        ) => SusaninRouteBase<Output, Defaults, Name, Data>

        addRoute<Input, Output, Defaults, Name extends string, Data>(
            config: SusaninRouteConfig<Input, Output, Defaults, Name, Data>
        ): SusaninRouteBase<Output, Defaults, Name, Data>

        findFirst<Output, Defaults, Name extends string, Data>(
            url: string,
            data?: Partial<Data>
        ): RouteWithParams<Output, Defaults, Name, Data> | null
    }

    export default Susanin;
}
