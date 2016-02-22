/* @flow */

import type {
    Route,
    SimpleLocation,
    Router,
    Redirector
} from 'modern-router/i/routerInterfaces'
import {observableFromEvent} from 'modern-router/utils'

export function locationRedirector(location: Location): Redirector {
    return {
        replace(url: string): void {
            location.replace(url)
        },
        redirect(url: string): void {
            location.href = url // eslint-disable-line
        }
    }
}

export function simpleFromLocation(location: Location): SimpleLocation {
    return {
        hostname: location.hostname,
        port: location.port,
        protocol: location.protocol.substring(1),
        method: 'GET'
    }
}

export function createLocationChanges(
    window: Object,
    location: Location,
    router: Router
): Observable<?Route, void> {
    function mapQueryData(): ?Route {
        return router.resolve(
            location.pathname + location.search,
            simpleFromLocation(location)
        )
    }
    return observableFromEvent(window, 'popstate').map(mapQueryData)
}
