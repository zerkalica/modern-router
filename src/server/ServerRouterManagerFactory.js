/* @flow */
import SusaninRouter from 'modern-router/SusaninRouter'

import type {
    LocationData,
    Router
} from 'modern-router'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

function defaultGetKey(params: LocationData): string {
    return `${params.protocol}-${params.hostname}-${params.port}`
}

export default class ServerRouterManagerFactory {
    _getKey: GetKey;
    _cache: Map<string, Router> = new Map();
    _config: RouterConfig;

    constructor(
        config: RouterConfig,
        getKey?: GetKey = defaultGetKey
    ) {
        this._config = config
        this._getKey = getKey
    }

    create(location: AbstractLocation): RouterManager {
        const params: LocationData = location.getParams()
        const key: string = this._getKey(params)
        const routerCache: Map<string, Router> = this._cache
        let router: ?Router = routerCache.get(key)
        if (!router) {
            router = new SusaninRouter(this._config, params)
            routerCache.set(key, router)
        }

        return new DefaultRouterManager(
            location,
            router
        )
    }
}
