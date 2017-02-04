/* @flow */

import type {LocationData} from 'modern-router/interfaces'
import AbstractLocation from 'modern-router/AbstractLocation'
import type {LocationCallback} from 'modern-router/AbstractLocation'
import Callbacks from 'modern-router/Callbacks'

function listenEvent<V>(
    target: Object,
    eventName: string,
    handler: (data: V) => void
): () => void {
    if (typeof target.addEventListener === 'function') {
        target.addEventListener(eventName, handler)
    } else if (typeof target.attachEvent === 'function') {
        target.attachEvent('on' + eventName, handler)
    }

    return function unsubscribe(): void {
        if (typeof target.removeEventListener === 'function') {
            target.removeEventListener(eventName, handler)
        } else if (typeof target.detachEvent === 'function') {
            target.detachEvent('on' + eventName, handler)
        }
    }
}

export default class BrowserLocation extends AbstractLocation {
    _location: Location
    _history: History
    _document: Document
    _callbacks: Callbacks<LocationData> = new Callbacks()
    _noFeedback: boolean

    constructor(win: Object, noFeedback?: boolean) {
        super()
        this._location = win.history.location || win.location
        this._history = win.history
        this._document = win.document
        this._noFeedback = noFeedback || false
        listenEvent(win, 'popstate', () => this._nextHistory())
    }

    getParams(): LocationData {
        const location = this._location

        return {
            pathname: location.pathname,
            search: location.search,
            hostname: location.hostname,
            port: location.port,
            protocol: location.protocol,
            format: 'html',
            method: 'GET'
        }
    }

    _nextHistory(): void {
        this._callbacks.next(this.getParams())
    }

    _next(): void {
        if (!this._noFeedback) {
            this._callbacks.next(this.getParams())
        }
    }

    dispose(): void {
        this._callbacks.dispose()
    }

    onChange(fn: LocationCallback): () => void {
        fn(this.getParams())
        return this._callbacks.onChange(fn)
    }

    replace(url: string): void {
        this._location.replace(url)
        this._next()
    }

    redirect(url: string): void {
        this._location.href = url // eslint-disable-line
        this._next()
    }

    redirectPost(url: string, params?: {
        [id: string]: string
    } = {}): void {
        const d = this._document
        const formNode = d.createElement('form')
        formNode.setAttribute('method', 'post')
        formNode.setAttribute('action', url)
        const keys = Object.keys(params)
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i]
            const inputNode = d.createElement('input')
            inputNode.setAttribute('type', 'hidden')
            inputNode.setAttribute('name', name)
            inputNode.setAttribute('value', params[name])
            formNode.appendChild(inputNode)
        }
        if (d.body) {
            d.body.appendChild(formNode)
        }
        formNode.submit()
    }

    pushState(query: Object, name: string, url?: string): void {
        this._history.pushState(query, name, url)
        this._next()
    }

    replaceState(query: Object, name: string, url?: string): void {
        this._history.replaceState(query, name, url)
        this._next()
    }
}
