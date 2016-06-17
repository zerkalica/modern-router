/* @flow */

import SusaninRouter from 'modern-router/SusaninRouter'

import type {
    Router
} from 'modern-router'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

export default class BrowserRouterManagerFactory {
    _config: RouterConfig;

    constructor(
        config: RouterConfig
    ) {
        this._config = config
    }

    create(location: AbstractLocation): RouterManager {
        const router: Router = new SusaninRouter(this._config, location.getParams())

        return new DefaultRouterManager(
            location,
            router
        )
    }
}
