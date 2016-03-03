/* @flow */

import Susanin from 'susanin'

import type {
    QueryMap,
    SimpleLocation,
    RouteConfig,
    RouterConfig,
    Route
} from 'modern-router/i/routerInterfaces'


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

    _addRoute(name: string, config: RouteConfig): void {
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
            name,
            pattern: config.pattern,
            defaults: config.defaults,
            conditions: config.conditions,
            data: {
                page: config.page || name,
                origin,
                method: 'GET',
                ...rd
            }
        })
    }

    isExternal(name: string): boolean {
        const router = this._susanin.getRouteByName(name)

        return router && router.data.origin
    }

    build(name: string, params?: QueryMap = {}): string {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error(`Route not found: ${name}`)
        }

        return (route.data.origin || '') + route.build(params)
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
