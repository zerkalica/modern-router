/* @flow */

import Susanin from 'susanin'

import type {
    RouteData,
    RouteDataDefaults,
    QueryMap,
    SimpleLocation,
    RouteConfig,
    RouterConfig,
    Route
} from 'modern-router/i/routerInterfaces'

type LocationParams = {
    path: string;
    params: {
        hostname: string;
        port: string;
        protocol: string;
        method: string;
    }
}

function routerLocationToParams(location: SimpleLocation): LocationParams {
    return {
        path: location.pathname + location.search,
        params: {
            hostname: location.hostname,
            port: location.port,
            protocol: location.protocol,
            method: location.method
        }
    }
}

function getOrigin(rd: SimpleLocation): string {
    const port = rd.port ? (':' + rd.port) : ''
    return rd.protocol + '//' + rd.hostname + port
}

type RouteSusaninData = {
    page: string;
    isFull: boolean;
    isExternal: boolean;
    hostname: string;
    port: string;
    protocol: string;
    method: string;
    origin: string;
}

// implements Router
export default class SusaninRouter {
    _susanin: Susanin;
    _getCurrentLocation: () => SimpleLocation;
    _defaultIsFull: boolean;
    _defaultLocation: RouteDataDefaults;

    constructor(
        config: RouterConfig,
        getCurrentLocation: () => SimpleLocation
    ) {
        const {routes, isFull} = config
        this._defaultIsFull = isFull || false
        this._susanin = new Susanin()
        const keys = Object.keys(routes)
        this._getCurrentLocation = getCurrentLocation
        this._defaultLocation = {
            ...getCurrentLocation(),
            pathname: undefined,
            search: undefined
        }
        for (let i = 0, l = keys.length; i < l; i++) {
            this._addRoute(keys[i], routes[keys[i]])
        }
    }

    _addRoute(name: string, config: RouteConfig): void {
        const cd: RouteData = config.data || {};
        const rd: SimpleLocation & RouteData = {
            ...this._defaultLocation,
            ...cd
        };
        const isExternal = !!(cd.port || cd.hostname || cd.protocol)

        const data: RouteSusaninData = {
            page: config.page || name,
            origin: getOrigin(rd),
            hostname: rd.hostname,
            port: rd.port,
            protocol: rd.protocol,
            method: rd.method || 'GET',
            isExternal,
            isReplace: cd.isReplace || false,
            isFull: isExternal || (
                cd.isFull === undefined
                    ? this._defaultIsFull
                    : cd.isFull
             )
        };

        this._susanin.addRoute({
            name,
            pattern: config.pattern,
            defaults: config.defaults,
            conditions: config.conditions,
            data
        })
    }

    getData(name: string): RouteData {
        const route = this._susanin.getRouteByName(name)
        const data: RouteSusaninData = route.getData();
        return data
    }

    build(name: string, params?: QueryMap = {}): string {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error(`Route not found: ${name}`)
        }

        const data: RouteSusaninData = route.getData();

        return (data.isFull ? data.origin : '') + route.build(params)
    }

    resolve(): ?Route {
        const {path, params} = routerLocationToParams(this._getCurrentLocation())
        const rec = this._susanin.findFirst(path, params)
        if (rec) {
            const [route, query] = rec
            const data: RouteSusaninData = route.getData();
            return {
                page: data.page,
                query
            }
        }

        return null
    }
}
