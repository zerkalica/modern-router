/* @flow */

import Susanin from 'susanin'

import type {
    Route,
    QueryMap,
    RouteData,
    LocationDataBase,
    LocationData,
    RouteConfigData,
    RouteConfig,
    RouterConfig
} from 'modern-router'

import RouteImpl from 'modern-router/Route'

type LocationParams = {
    path: string;
    params: LocationDataBase;
}

function routerLocationToParams(location: LocationData): LocationParams {
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

function getOrigin(rd: {
    port: ?string,
    hostname: string,
    protocol: string
}): string {
    const port = rd.port ? (':' + rd.port) : ''
    return rd.protocol + '//' + rd.hostname + port
}

type RouteSusaninData = {
    page: string;
    isFull: boolean;
    isExternal: boolean;
    isReplace: boolean;
    hostname: string;
    port: ?string;
    protocol: string;
    method: string;
    origin: string;
}

// implements Router
export default class SusaninRouter {
    _susanin: Susanin;
    _defaultIsFull: boolean;
    _defaultLocation: LocationDataBase;

    constructor(
        config: RouterConfig,
        cl: LocationData
    ) {
        const {routes, isFull} = config
        this._defaultIsFull = isFull || false
        this._susanin = new Susanin()
        const keys = Object.keys(routes)
        this._defaultLocation = {
            hostname: cl.hostname,
            port: cl.port,
            protocol: cl.protocol,
            method: cl.method
        }
        for (let i = 0, l = keys.length; i < l; i++) {
            this._addRoute(keys[i], routes[keys[i]])
        }
    }

    _addRoute(name: string, config: RouteConfig): void {
        const cd: RouteConfigData = config.data || {};
        const dl = this._defaultLocation
        const rd: LocationDataBase = {
            hostname: cd.hostname || dl.hostname,
            port: cd.port || dl.port,
            protocol: cd.protocol || dl.protocol,
            method: cd.method || dl.method
        };

        const isExternal: boolean = !!(cd.port || cd.hostname || cd.protocol);

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

    build(name: string, params?: QueryMap = {}): string {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error(`Route not found: ${name}`)
        }

        const data: RouteSusaninData = route.getData();

        return (data.isFull ? data.origin : '') + route.build(params)
    }

    find(options: LocationData): Route {
        const params: LocationParams = routerLocationToParams(options);
        const rec = this._susanin.findFirst(params.path, params.params)
        if (rec) {
            const [route, query] = rec
            const data: RouteSusaninData = route.getData();
            return new RouteImpl(data.page, query, (data: RouteData))
        }

        return new RouteImpl()
    }
}
