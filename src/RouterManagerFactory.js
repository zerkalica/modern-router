/* @flow */

import type {
    GetKey,
    CreateRouter,
    LocationData,
    Router
} from 'modern-router/interfaces'

import RouterManager from 'modern-router/RouterManager'
import AbstractLocation from 'modern-router/AbstractLocation'

function defaultGetKey(params: LocationData): string {
    return `${params.protocol}-${params.hostname}-${params.port || ''}`
}

export default class RouterManagerFactory {
    _getKey: GetKey;
    _cache: Map<string, Router> = new Map();
    _createRouter: CreateRouter;

    constructor(
        createRouter: CreateRouter,
        getKey?: GetKey = defaultGetKey
    ) {
        this._getKey = getKey
        this._createRouter = createRouter
    }

    create(location: AbstractLocation): RouterManager {
        const params: LocationData = location.getParams()
        const key: string = this._getKey(params)
        const routerCache: Map<string, Router> = this._cache
        let router: ?Router = routerCache.get(key)
        if (!router) {
            router = this._createRouter(params)
            routerCache.set(key, router)
        }

        return new RouterManager(
            location,
            router
        )
    }
}
