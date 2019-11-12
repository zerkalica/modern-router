import { RouteConfig, PartialDefaults } from '../RouterInterfaces'
import Susanin, { Route as SusaninRoute, SusaninRouteConfig } from 'susanin'
import { getTokens } from './getTokens'

export class SusaninRouteType<Input, Output, Data, Defaults, Name extends string> {
    protected susaninRoute: SusaninRoute<Output, Data, Defaults, Name>

    constructor({
        data,
        defaults,
        pattern,
        fromQuery,
        toQuery,
        conditions,
    }: RouteConfig<Input, Output, Data, Defaults>) {
        const susaninRouteConfig: SusaninRouteConfig<
            Input,
            Output,
            Data,
            Defaults,
            Name
        > = {
            postMatch: raw => fromQuery(raw),
            preBuild: params => toQuery(params),
            data,
            defaults,
            conditions,
            pattern: pattern(getTokens(fromQuery)),
            name,
        }

        this.susaninRoute = new Susanin.Route(susaninRouteConfig)
    }

    get name() {
        return this.susaninRoute.getName()
    }

    toQuery(params: PartialDefaults<Output, Defaults>): string {
        return this.susaninRoute.build(params)
    }

    fromQuery(url: string): Output {
        const params = this.susaninRoute.match(url)
        if (!params)
            throw new Error(
                `Url ${url} not matched by ${this.susaninRoute.getName()}`
            )
        return params
    }
}
