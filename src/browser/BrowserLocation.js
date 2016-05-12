/* @flow */

import type {
    LocationData,
    AbstractLocation // eslint-disable-line
} from 'modern-router'

// implements AbstractLocation
export default class BrowserLocation {
    _location: Location;
    _history: History;

    constructor(location: Location, history: History) {
        this._location = location
        this._history = history
    }

    replace(url: string): void {
        this._location.replace(url)
    }

    redirect(url: string): void {
        this._location.href = url // eslint-disable-line
    }

    pushState(query: Object, name: string, url?: string): void {
        this._history.pushState(query, name, url)
    }

    replaceState(query: Object, name: string, url?: string): void {
        this._history.replaceState(query, name, url)
    }

    getParams(): LocationData {
        const location = this._location

        return {
            pathname: location.pathname,
            search: location.search,
            hostname: location.hostname,
            port: location.port,
            protocol: location.protocol,
            method: 'GET'
        }
    }
}
