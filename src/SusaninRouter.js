/* @flow */

import Susanin from 'susanin'

import type {
    ContentFormat,
    IRouterConfig,
    Router,
    QueryMap,
    RouteData,
    LocationDataBase,
    LocationData,
    RouteConfig
} from './interfaces'

import Route from './Route'
import shallowEqual from './shallowEqual'

type LocationParams = {
    path: string;
    params: LocationDataBase;
}

function routerLocationToParams(location: LocationData): LocationParams {
    return {
        path: location.pathname + location.search,
        params: {
            format: location.format,
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

export interface DefaultLocation {
    hostname: string;
    port: ?string;
    protocol: string;
    method: string;
    format: ContentFormat;
}

// implements Router
export default class SusaninRouter implements Router {
    _susanin: Susanin
    _defaultIsFull: boolean
    _defaultLocation: DefaultLocation
    _prefix: string

    constructor(
        config: IRouterConfig,
        defaultLocation: DefaultLocation
    ) {
        const {routes, isFull, prefix} = config
        this._prefix = prefix || ''
        if (!routes) {
            throw new Error('No routes found in config')
        }
        this._defaultIsFull = isFull || false
        this._susanin = new Susanin()
        const keys = Object.keys(routes)
        this._defaultLocation = {
            format: defaultLocation.format,
            hostname: defaultLocation.hostname,
            port: defaultLocation.port,
            protocol: defaultLocation.protocol,
            method: defaultLocation.method
        }
        for (let i = 0, l = keys.length; i < l; i++) {
            this._addRoute(keys[i], routes[keys[i]])
        }
    }

    _addRoute(name: string, config: RouteConfig): void {
        const dl = this._defaultLocation
        const rd: LocationDataBase = {
            format: config.format || dl.format,
            hostname: config.hostname || dl.hostname,
            port: config.port || dl.port,
            protocol: config.protocol || dl.protocol,
            method: config.method || dl.method
        }

        const isExternal: boolean = !!(config.port || config.hostname || config.protocol)

        const data: RouteSusaninData = {
            page: config.page || name,
            origin: getOrigin(rd),
            format: rd.format,
            hostname: rd.hostname,
            port: rd.port,
            protocol: rd.protocol,
            method: rd.method || 'GET',
            isExternal,
            isReplace: config.isReplace || false,
            isFull: isExternal || (
                config.isFull === undefined
                    ? this._defaultIsFull
                    : config.isFull
             )
        }

        this._susanin.addRoute({
            name,
            pattern: config.pattern,
            defaults: config.defaults,
            conditions: config.conditions,
            data
        })
    }

    getRouteByName(name: string, query?: ?Object): ?Route {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            return null
        }
        const data = route.getData()

        return new Route({
            page: data.page,
            name: route.getName(),
            data,
            query: query || {}
        })
    }

    build(name: string, params?: QueryMap = {}): string {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error(`Route not found: ${name}`)
        }

        const data: RouteSusaninData = route.getData()
        const newParams = shallowEqual(params, route._options.defaults)
            ? {}
            : params

        return (data.isFull ? data.origin : '') + route.build(newParams)
    }

    find(options: LocationData): Route {
        const params: LocationParams = routerLocationToParams(options)
        const path = (this._prefix && params.path.indexOf(this._prefix) === 0)
            ? params.path.substring(this._prefix.length)
            : params.path

        const rec = this._susanin.findFirst(path, params.params)

        if (rec) {
            const [route, query] = rec
            const data: RouteSusaninData = route.getData()
            return new Route({
                page: data.page,
                name: route.getName(),
                query,
                data: (data: RouteData)
            })
        }

        return new Route({})
    }
}
