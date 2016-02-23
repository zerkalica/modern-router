/* @flow */

import HistoryRouterLocation from 'modern-router/HistoryRouterLocation'
import SusaninRouter from 'modern-router/SusaninRouter'
import {
    createLocationChanges,
    simpleFromLocation,
    locationRedirector
} from 'modern-router/browserHelpers'

import type {
    Redirector,
    Route,
    RouterLocation,
    SimpleLocation,
    Router,
    RouterConfig,
    RouterManager
} from 'modern-router/i/routerInterfaces'

export default function createBrowserRouterManager(
    window: Object,
    config: RouterConfig
): RouterManager {
    const docLocation: Location = window.document.location;
    const redirector: Redirector = locationRedirector(docLocation);
    const defaultLocation: SimpleLocation = simpleFromLocation(docLocation);
    const router: Router = new SusaninRouter(config, defaultLocation);
    const locationChanges: Observable<?Route, void> = createLocationChanges(
        window,
        docLocation,
        router
    );
    const location: RouterLocation = new HistoryRouterLocation(
        window.history,
        locationChanges,
        redirector,
        router
    );

    return {
        locationChanges,
        redirector,
        router,
        location
    }
}
