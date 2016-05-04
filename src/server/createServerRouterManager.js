/* @flow */

import SusaninRouter from 'modern-router/SusaninRouter'
import ServerLocation from 'modern-router/server/ServerLocation'

import type {
    AbstractLocation,
    Router,
    RouterConfig,
    RouterManager
} from 'modern-router/i/routerInterfaces'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

function noop() {}

const routerCache: Map<string, Router> = new Map();

export default function createServerRouterManager(
    req: http$IncomingMessage,
    res: http$ServerResponse,
    config: RouterConfig
): RouterManager {
    const location: AbstractLocation = new ServerLocation(req, res);
    const popState: Observable<void, Error> = new Observable(noop)
    const params = location.getParams()
    const key: string = `${params.protocol}-${params.host}-${params.port}`;
    let router: Router = routerCache.get(key)
    if (!router) {
        router = new SusaninRouter(config, params);
        routerCache.set(key, router)
    }

    return new DefaultRouterManager(
        location,
        router,
        popState.map(() => location)
    )
}
