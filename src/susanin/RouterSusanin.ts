/// <reference path="./susanin.d.ts" />
import Susanin, { Route as SusaninRouteRaw, SusaninRouteConfig } from 'susanin'

import { PageNotFoundError, Router, RouterOptions } from '../Router'
import { AllRoutesConfig, Route, RouteConfig, CurrentRoute } from '../RouterInterfaces'
import { RouteSusanin } from './RouteSusanin'
import { getTokens } from './getTokens'

class RouterSusanin<Config extends AllRoutesConfig, Context> extends Router<Config, Context> {
    protected susanin = new Susanin()
    protected facades = new WeakMap<SusaninRouteRaw, Route>()

    protected createRoute<Input, Output, Data, Defaults, Name extends string>(
        {
            data,
            defaults,
            pattern,
            fromQuery,
            toQuery,
            conditions,
        }: RouteConfig<Input, Output, Data, Defaults>,
        name: Name
    ): Route<Output, Data, Defaults, Name> {
        const susaninRouteConfig: SusaninRouteConfig<Input, Output, Data, Defaults, Name> = {
            postMatch: raw => fromQuery(raw),
            preBuild: params => toQuery(params),
            data,
            defaults,
            conditions,
            pattern: pattern(getTokens(fromQuery)),
            name,
        }

        const rawRoute = this.susanin.addRoute(susaninRouteConfig)

        const facade = new RouteSusanin(rawRoute, this)
        this.facades.set(rawRoute, facade)
        return facade
    }

    protected current(): CurrentRoute<Config> {
        const rec = this.susanin.findFirst(this.currentUrl)
        if (!rec) throw new PageNotFoundError(this.currentUrl)
        const [route] = rec
        const facade = this.facades.get(route)
        if (!facade) throw new PageNotFoundError(this.currentUrl)

        return (facade as unknown) as CurrentRoute<Config>
    }
}

export function routerSusanin<Config, Context>(options: RouterOptions<Config, Context>) {
    return new RouterSusanin(options).routes
}
