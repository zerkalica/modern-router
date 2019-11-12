import {
    AllRouteTypes,
    AllRoutes,
    CurrentRoute,
    PickContext,
} from './RouterInterfaces'
import { Route, IRouter, RouteNotFoundError } from './Route'
import { failHidden } from './schema'

export interface HistoryLike {
    pushState(data: any, title: string, url?: string | null): void
    replaceState(data: any, title: string, url?: string | null): void
}

export interface LocationLike {
    search?: string
    origin?: string
    port?: string
    pathname: string
    hostname: string
}

export interface LocationStoreOptions {
    location?: LocationLike
    refresh?: () => void
    history?: HistoryLike
    target?: Window
}

export class PageNotFoundError extends Error {
    readonly url: string
    readonly routes: RouteNotFoundError[]

    constructor(url: string, routes: RouteNotFoundError[]) {
        super(
            `Page not found for url "${url}", routes: ${JSON.stringify(routes)}`
        )
        this.url = url
        this.routes = routes
    }
}

export interface RouterOptions<RouteTypes extends AllRouteTypes, Context>
    extends LocationStoreOptions {
    routes: RouteTypes
    context: Context
}

const defaultLocation: Required<LocationLike> = {
    search: '',
    origin: '',
    pathname: '',
    port: '80',
    hostname: '',
}

export class Router<
    RouteTypes extends AllRouteTypes,
    Context extends PickContext<RouteTypes> = PickContext<RouteTypes>
> implements IRouter<Context> {
    protected location: Required<LocationLike>
    protected refresh: () => void
    protected history?: HistoryLike
    protected target?: Window
    protected types: RouteTypes

    readonly context: Context

    constructor({
        location = defaultLocation,
        refresh = empty,
        history,
        target,
        routes,
        context,
    }: RouterOptions<RouteTypes, Context>) {
        this.location = { ...defaultLocation, ...location }
        this.refresh = refresh
        this.history = history
        this.target = target
        this.types = routes
        this.context = context
        if (target) target.addEventListener('popstate', this.onPopState)
    }

    private routesCache: AllRoutes<RouteTypes> | undefined = undefined

    get routes(): AllRoutes<RouteTypes> {
        if (this.routesCache) return this.routesCache

        const { types } = this
        const keys = Object.keys(types)
        const routes = {} as Record<keyof RouteTypes, any>

        for (let key of keys) {
            const route = new Route(types[key], this, key)
            routes[key as keyof RouteTypes] = route
        }

        this.routesCache = routes as AllRoutes<RouteTypes>

        return this.routesCache
    }

    destructor() {
        const target = this.target
        if (target) target.removeEventListener('popstate', this.onPopState)
    }

    private onPopState = () => {
        this.refresh()
    }

    private nextUrl: string | undefined = undefined

    get currentUrl(): string {
        return this.nextUrl === undefined
            ? this.location.pathname + this.location.search
            : this.nextUrl
    }

    get current(): CurrentRoute<RouteTypes> {
        const { routes, currentUrl } = this
        const errors: RouteNotFoundError[] = []
        const keys = Object.keys(routes)
        for (let key of keys) {
            const route = routes[key]
            try {
                route.params
                return (route as unknown) as CurrentRoute<RouteTypes>
            } catch (e) {
                if (e instanceof Promise) return failHidden(e)
                if (!(e instanceof RouteNotFoundError)) return failHidden(e)
                errors.push(e)
            }
        }
        throw new PageNotFoundError(currentUrl, errors)
    }

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

/**
 *
 * ```ts
 * const r = route.config({
 *    search: route(
 *    s.rec({
 *        controller: s.num,
 *        action: s.opt(s.num),
 *        id: s.str,
 *    }),
 *    {
 *        pattern: p => `/${p.action}/${p.id}/qwe`,
 *    }),
 *    offer: route(
 *    s.rec({
 *        id: s.str,
 *    }),
 *    {
 *        pattern: p => `/offer/${p.id}`,
 *    }),
 * })
 * ```
 **/
export function routerConfig<Config>(
    config: AllRouteTypes<Config>
): AllRouteTypes<Config> {
    return config
}
