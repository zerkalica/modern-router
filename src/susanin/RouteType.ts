import { PartialDefaults, RouteType, Tokens } from '../RouterInterfaces'
import Susanin, { Route as SusaninRoute, SusaninRouteConfig } from 'susanin'
import { getTokens } from './getTokens'
import { RecMetadata } from '../schema'
import { RouteNotFoundError } from '../Route'

export type SusaninRouteTypeOptions<
    Input,
    Output,
    Defaults extends Partial<Output> | undefined,
    Context
> = {
    readonly defaults?: Defaults
    pattern(p: Tokens<Input>): string
    toQuery: ((p: Output, context: Context) => Input) & RecMetadata
    fromQuery: (p: Input, context: Context) => Output
}

class SusaninRouteType<Input, Output, Defaults, Context>
    implements RouteType<Output, Defaults, Context> {
    protected susaninRoute: SusaninRoute<Output, Defaults>
    protected _context: Context | undefined = undefined

    constructor(options: SusaninRouteTypeOptions<Input, Output, Defaults, Context>) {
        const pattern = options.pattern(getTokens(options.toQuery))
        const susaninRouteConfig: SusaninRouteConfig<
            Input,
            Output,
            any,
            Defaults,
            string
        > = {
            postMatch: raw => options.fromQuery(raw, this.context),
            preBuild: params => options.toQuery(params, this.context),
            defaults: options.defaults,
            // conditions,
            pattern,
            name: pattern,
        }

        this.susaninRoute = new Susanin.Route(susaninRouteConfig)
    }

    protected get context(): Context {
        if (!this._context) throw new Error(`Context is not set in Router`)
        return this._context
    }

    get name() {
        return this.susaninRoute.getName()
    }

    toUrl(params: PartialDefaults<Output, Defaults>, context?: Context): string {
        this._context = context
        return this.susaninRoute.build(params)
    }

    fromUrl(url: string, context?: Context): Output {
        this._context = context
        const params = this.susaninRoute.match(url)
        if (!params) throw new RouteNotFoundError(url, this)

        return params
    }
}

export function route<Input, Output, Defaults, Context>(
    options: SusaninRouteTypeOptions<Input, Output, Defaults, Context>
): RouteType<Output, Defaults, Context> {
    return new SusaninRouteType(options)
}
