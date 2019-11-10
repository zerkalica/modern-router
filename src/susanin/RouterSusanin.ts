/// <reference path="./susanin.d.ts" />
import Susanin, { Route as SusaninRouteRaw, SusaninRouteConfig } from 'susanin'

import { PageNotFoundError, Router, RouterOptions } from '../Router'
import { AllRoutesConfig, Route, RouteConfig, CurrentRoute } from '../RouteType'
import { RouteSusanin } from './RouteSusanin'
import { getTokens } from '../schema'

class RouterSusanin<C extends AllRoutesConfig, Context> extends Router<C, Context> {
    protected susanin = new Susanin()
    protected facades = new WeakMap<SusaninRouteRaw, Route>()

    protected createRoute<Params, Data, Defaults = Partial<Params>, Name extends string = string>(
        { data, defaults, pattern, postMatch, preBuild, validate }: RouteConfig<Params, Data, Defaults, Context>,
        name: Name
    ): Route<Params, Data, Defaults, Name> {
        const susaninRouteConfig: SusaninRouteConfig<Params, Data, Defaults, Name> = {
            postMatch: postMatch
                ? raw => validate(postMatch(raw, this.context))
                : raw => validate((raw as unknown) as Params),
            preBuild: preBuild ? params => preBuild(params, this.context) : undefined,
            data,
            defaults,
            pattern: pattern(getTokens(validate)),
            name,
        }

        const rawRoute = this.susanin.addRoute(susaninRouteConfig)

        const facade = new RouteSusanin(rawRoute, this)
        this.facades.set(rawRoute, facade)
        return facade
    }

    protected current(): CurrentRoute<C> {
        const rec = this.susanin.findFirst(this.currentUrl)
        if (!rec) throw new PageNotFoundError(this.currentUrl)
        const [route] = rec
        const facade = this.facades.get(route)
        if (!facade) throw new PageNotFoundError(this.currentUrl)

        return (facade as unknown) as CurrentRoute<C>
    }
}

export function routerSusanin<Config, Context>(options: RouterOptions<Config, Context>) {
    return new RouterSusanin(options).routes
}
