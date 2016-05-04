/* @flow */

import type {
    SimpleLocation,
    AbstractLocation // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

import {parse} from 'url'

// implements AbstractLocation
export default class ServerLocation {
    _req: http$IncomingMessage;
    _res: http$ServerResponse;

    constructor(
        req: http$IncomingMessage,
        res: http$ServerResponse
    ) {
        this._req = req
        this._res = res
    }

    replace(url: string): void { // eslint-disable-line
        this.redirect(url)
    }

    redirect(url: string): void { // eslint-disable-line
        this._res.writeHead(301, {
            Location: url
        })
        this._res.end()
    }

    pushState(query: Object, name: string, url: string): void {
        this.redirect(url)
    }

    replaceState(query: Object, name: string, url: string): void {
        this.redirect(url)
    }

    getParams(): SimpleLocation {
        const req = this._req
        const headers = req.headers
        const parts = parse((req.url: any))

        return {
            pathname: parts.pathname,
            search: parts.search,
            hostname: headers.host,
            port: headers.port,
            protocol: headers.protocol || 'https',
            method: req.method
        }
    }
}
