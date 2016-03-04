/* @flow */

import HistoryRouterLocation from 'modern-router/HistoryRouterLocation'
import SusaninRouter from 'modern-router/SusaninRouter'
import {
    createRouterState,
    createBrowserLocationGetter,
    BrowserLocationRedirector
} from 'modern-router/browser/browserHelpers'

import type {
    RouterLocation,
    Router,
    RouterConfig,
    RouterManager
} from 'modern-router/i/routerInterfaces'

import DefaultRouterManager from 'modern-router/DefaultRouterManager'

export default function createBrowserRouterManager(
    window: Object,
    config: RouterConfig
): RouterManager {
    const docLocation: Location = window.document.location;

    const router: Router = new SusaninRouter(config, createBrowserLocationGetter(docLocation));
    const location: RouterLocation = new HistoryRouterLocation(
        window.history,
        new BrowserLocationRedirector(docLocation),
        router
    );

    return new DefaultRouterManager(
        createRouterState(window, router),
        router,
        location
    )
}
