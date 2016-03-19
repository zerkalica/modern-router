/* @flow */

import type {
    SimpleLocation,
    Redirector // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

// implements Redirector
export class BrowserLocationRedirector {
    _location: Location;

    constructor(location: Location) {
        this._location = location
    }

    replace(url: string): void {
        location.replace(url)
    }

    redirect(url: string): void {
        location.href = url // eslint-disable-line
    }
}

function simpleFromLocation(location: Location): SimpleLocation {
    return {
        pathname: location.pathname,
        search: location.search,
        hostname: location.hostname,
        port: location.port,
        protocol: location.protocol,
        method: 'GET'
    }
}

export function createBrowserLocationGetter(location: Location): () => SimpleLocation {
    return function locationGetter(): SimpleLocation {
        return simpleFromLocation(location)
    }
}
