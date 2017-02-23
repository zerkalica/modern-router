/* @flow */

import type {
    Router,
    GetKey,
    LocationData,
    IRouterConfig
} from './interfaces'

import RouterManager from './RouterManager'
import AbstractLocation from './AbstractLocation'
import SusaninRouter from './SusaninRouter'

function defaultGetKey(params: LocationData): string {
    return `${params.protocol}-${params.hostname}-${params.port || ''}`
}

export default function createRouterFactory(
    config: IRouterConfig,
    getKey?: GetKey = defaultGetKey
): (location: AbstractLocation) => RouterManager {
    const cache: Map<string, Router> = new Map()

    return function routerFactory(location: AbstractLocation): RouterManager {
        const key = getKey(location.getParams())
        let router: ?Router = cache.get(key)
        if (!router) {
            router = new SusaninRouter(config, location.getParams())
            cache.set(key, router)
        }

        return new RouterManager(location, router)
    }
}
