import { IRoute, RouteType, PartialDefaults } from './RouterInterfaces'

export interface IRouter<Context> {
    readonly currentUrl: string
    readonly context: Context
    update(nextUrl: string, replace?: boolean): void
}

export class RouteNotFoundError extends Error {
    constructor(url: string, route: object) {
        super(`Route "${route}" not match url "${url}"`)
    }
}

export class Route<Output, Defaults, Name extends string, Context>
    implements IRoute<Output, Defaults, Name> {
    protected type: RouteType<Output, Defaults>
    protected router: IRouter<Context>

    readonly name: Name

    constructor(
        type: RouteType<Output, Defaults>,
        router: IRouter<Context>,
        name: Name
    ) {
        this.name = name
        this.type = type
        this.router = router
    }

    toString() {
        return this.name
    }

    get params(): Output {
        const currentUrl = this.router.currentUrl
        return this.type.fromUrl(currentUrl, this.router.context)
    }

    push(params: PartialDefaults<Output, Defaults>) {
        this.router.update(this.url(params))
    }

    replace(params: PartialDefaults<Output, Defaults>) {
        this.router.update(this.url(params), true)
    }

    url(params: PartialDefaults<Output, Defaults>): string {
        return this.type.toUrl(params, this.router.context)
    }
}
