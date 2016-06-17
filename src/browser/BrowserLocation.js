/* @flow */

import type {
    LocationData,
    AbstractLocation // eslint-disable-line
} from 'modern-router'

import {observableFromEvent} from 'observable-helpers/browser'
import {mapObservable} from 'observable-helpers'

interface BrowserLocationProps {
    location: Location;
    history: History;
}

// implements AbstractLocation
export default class BrowserLocation {
    _location: Location;
    _history: History;
    constructor(win: BrowserLocationProps) {
        this._location = win.history.location || win.location
        this._history = win.history;
        (this: Object)[Symbol.observable] = () =>
            mapObservable(observableFromEvent(win, 'popstate'), () => this)
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
