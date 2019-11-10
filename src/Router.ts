import { RouteConfig, AllRoutesConfig, AllRoutes, Route, CurrentRoute } from './RouteType'

export interface HistoryLike {
    pushState(data: any, title: string, url?: string | null): void
    replaceState(data: any, title: string, url?: string | null): void
}

export interface LocationLike {
    search: string
    origin: string
    pathname: string
    port: string
    hostname: string
}

export interface LocationStoreOptions {
    location?: LocationLike
    refresh?: () => void
    history?: HistoryLike
    target?: Window
}

export class PageNotFoundError extends Error {
    constructor(url: string) {
        super(`Route not found for url "${url}"`)
    }
}

export interface RouterOptions<Config extends AllRoutesConfig, Context> extends LocationStoreOptions {
    routerConfig: Config
    context: Context
}

const defaultLocation: LocationLike = {
    search: '',
    origin: '',
    pathname: '',
    port: '',
    hostname: '',
}

export abstract class Router<Config extends AllRoutesConfig, Context> {
    protected location: LocationLike
    protected refresh: () => void
    protected history?: HistoryLike
    protected target?: Window
    protected context: Context
    protected routerConfig: Config

    constructor({
        location = defaultLocation,
        refresh = empty,
        history,
        target,
        routerConfig,
        context,
    }: RouterOptions<Config, Context>) {
        this.location = location
        this.refresh = refresh
        this.history = history
        this.target = target
        this.routerConfig = routerConfig
        this.context = context
        if (target) target.addEventListener('popstate', this.onPopState)
    }

    private _routes: AllRoutes<Config> | undefined = undefined

    get routes(): AllRoutes<Config> {
        if (this._routes) return this._routes

        const { routerConfig } = this
        const keys = Object.keys(routerConfig)
        const routes = {} as Record<string, Route>

        Object.defineProperty(routes, 'current', {
            get: this.current.bind(this),
            enumerable: true,
        })

        for (let key of keys) {
            routes[key] = this.createRoute(routerConfig[key], key)
        }

        this._routes = routes as AllRoutes<Config>

        return this._routes
    }

    protected abstract createRoute<Params, Data, Defaults, Name extends string>(
        config: RouteConfig<Params, Data, Defaults, Context>,
        name: Name
    ): Route<Params, Data, Defaults, Name>

    destructor() {
        const target = this.target
        if (target) target.removeEventListener('popstate', this.onPopState)
    }

    private onPopState = () => {
        this.refresh()
    }

    private nextUrl: string | undefined = undefined

    get currentUrl(): string {
        return this.nextUrl === undefined ? this.location.pathname + this.location.search : this.nextUrl
    }

    protected abstract current(): CurrentRoute<Config>

    update(nextUrl: string, replace: boolean = false) {
        this.nextUrl = nextUrl
        if (this.history) {
            if (replace) this.history.replaceState(null, '', this.currentUrl)
            else this.history.pushState(null, '', this.currentUrl)
        }
        this.refresh()
    }
}

function empty() {}
