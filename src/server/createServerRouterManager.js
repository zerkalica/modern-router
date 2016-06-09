/* @flow */
import {mapObservable} from 'observable-helpers'

import SusaninRouter from 'modern-router/SusaninRouter'

import type {
    AbstractLocation,
    Router,
    RouterConfig,
    RouterManager
} from 'modern-router'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

function noop() {}

const routerCache: Map<string, Router> = new Map()

export default function createServerRouterManager(
    location: AbstractLocation,
    config: RouterConfig
): RouterManager {
    const popState: Observable<void, Error> = new Observable(noop)
    const params = location.getParams()
    const key: string = `${params.protocol}-${params.hostname}-${params.port}`
    let router: ?Router = routerCache.get(key)
    if (!router) {
        router = new SusaninRouter(config, params)
        routerCache.set(key, router)
    }

    return new DefaultRouterManager(
        location,
        router,
        mapObservable(popState, () => location)
    )
}
