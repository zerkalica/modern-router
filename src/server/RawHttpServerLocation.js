/* @flow */

import type {
    LocationData,
    AbstractLocation // eslint-disable-line
} from 'modern-router'

import {parse} from 'url'

interface Req {
    method: string;
    url: string;
    headers: Object;
}

// implements AbstractLocation
export default class RawHttpServerLocation {
    _req: Req;
    _res: http$ServerResponse;

    _protocol: string;
    _isTrustedProxy: boolean;

    constructor(
        req: Req,
        res: http$ServerResponse,
        isHttps?: boolean = false,
        isTrustedProxy?: boolean = true
    ) {
        this._req = req
        this._res = res
        this._protocol = isHttps ? 'https' : 'http'
        this._isTrustedProxy = isTrustedProxy
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

    _getHostNameFromHeaders(headers: Object): {
        hostname: string;
        port: string;
        protocol: string;
    } {
        const host: string = this._isTrustedProxy
            ? (headers['x-forwarded-host'] || headers.host)
            : headers.host;

        // IPv6 literal support
        const offset: number = host[0] === '['
            ? host.indexOf(']') + 1
            : 0;

        const index: number = host.indexOf(':', offset);

        const hostname: string = index !== -1
            ? host.substring(0, index)
            : host;

        const port: string = index !== -1
            ? host.substring(index + 1)
            : '';

        const protocol: string = this._isTrustedProxy
            ? (headers['x-forwared-proto'] || this._protocol)
            : this._protocol;

        return {
            hostname,
            port,
            protocol: protocol.split(/\s*,\s*/)[0]
        }
    }

    getParams(): LocationData {
        const req = this._req
        const {
            hostname,
            port,
            protocol
        } = this._getHostNameFromHeaders(req.headers)
        const parts = parse((req.url: any))

        const result: LocationData = {
            pathname: parts.pathname || '',
            search: parts.search || '',
            hostname,
            port,
            protocol,
            method: req.method
        };
        // console.log(result)

        return result
    }
}