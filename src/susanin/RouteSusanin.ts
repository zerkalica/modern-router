import { Route as RouteSusaninRaw } from 'susanin'
import { Router } from '../Router'
import { Route, PartialDefaults, AllRoutesConfig } from '../RouteType'

export class RouteSusanin<
    Config extends AllRoutesConfig,
    Context,
    Params,
    Data,
    Defaults extends Partial<Params>,
    Name extends string
> implements Route<Params, Data, Defaults, Name> {
    protected susaninRoute: RouteSusaninRaw<Params, Data, Defaults, Name>
    protected router: Router<Config, Context>

    constructor(route: RouteSusaninRaw<Params, Data, Defaults, Name>, router: Router<Config, Context>) {
        this.susaninRoute = route
        this.router = router
    }

    toString() {
        return this.name
    }

    get name(): Name {
        return this.susaninRoute.getName()
    }

    get params(): Params {
        const { currentUrl, routes } = this.router
        const params = this.susaninRoute.match(currentUrl)
        if (!params)
            throw new Error(
                `Route "${this}" can't match url "${currentUrl}",  use route "${routes.current}"`
            )

        return params
    }

    push(params: PartialDefaults<Params, Defaults>) {
        this.router.update(this.susaninRoute.build(params))
    }

    replace(params: PartialDefaults<Params, Defaults>) {
        this.router.update(this.susaninRoute.build(params), true)
    }

    url(params: PartialDefaults<Params, Defaults>): string {
        return this.susaninRoute.build(params)
    }
}
