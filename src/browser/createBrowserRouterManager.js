/* @flow */

import SusaninRouter from 'modern-router/SusaninRouter'
import BrowserLocation from 'modern-router/browser/BrowserLocation'
import {observableFromEvent} from 'observable-helpers/browser'
import {mapObservable} from 'observable-helpers'

import type {
    AbstractLocation,
    Router,
    RouterConfig,
    RouterManager
} from 'modern-router'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

export default function createBrowserRouterManager(
    window: Object,
    config: RouterConfig
): RouterManager {
    const location: AbstractLocation = new BrowserLocation(
        window.history.location || window.location,
        window.history
    )
    const popState: Observable<AbstractLocation, Error> =
        mapObservable(observableFromEvent(window, 'popstate'), () => location)

    const router: Router = new SusaninRouter(config, location.getParams())

    return new DefaultRouterManager(
        location,
        router,
        popState
    )
}
