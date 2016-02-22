/* @flow */

import Susanin from 'susanin'

import type {
    QueryMap,
    SimpleLocation,
    RouteConfig,
    RouterConfig,
    Route
} from 'reactive-router/i/routerInterfaces'


// implements Router
export default class SusaninRouter {
    _susanin: Susanin;
    _defaultLocation: SimpleLocation;

    constructor(routes: RouterConfig, defaultLocation: SimpleLocation) {
        this._susanin = new Susanin()
        const keys = Object.keys(routes)
        this._defaultLocation = defaultLocation
        for (let i = 0, l = keys.length; i < l; i++) {
            this._addRoute(keys[i], routes[keys[i]])
        }
    }

    _addRoute(page: string, config: RouteConfig): void {
        const data = config.data || {}
        const rd: SimpleLocation = {
            ...this._defaultLocation,
            ...data
        };
        let origin: string;
        if (data.port || data.protocol || data.hostname) {
            const port = rd.port ? (':' + rd.port) : ''
            origin = rd.protocol + '//' + rd.hostname + port
        }

        this._susanin.addRoute({
            page,
            pattern: config.pattern,
            defaults: config.defaults,
            conditions: config.conditions,
            data: {
                page: config.page || page,
                origin,
                method: 'GET',
                ...rd
            }
        })
    }

    getRoute(name: string, params: ?QueryMap = {}): {
        isExternal: boolean,
        url: string
    } {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error(`Route not found: ${name}`)
        }

        const {origin} = route.data

        return {
            url: (origin ? origin : '') + route.build(params),
            isExternal: !!origin
        }
    }

    build(name: string, params: ?QueryMap = {}): string {
        return this.getRoute(name, params).url
    }

    resolve(path: string, params: SimpleLocation): ?Route {
        const rec = this._susanin.findFirst(path, params)
        if (rec) {
            const [route, query] = rec
            return {
                page: route.getData().page,
                query
            }
        }

        return null
    }
}
