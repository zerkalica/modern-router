/* @flow */

import type {
    LocationData,
    ContentFormat
} from 'modern-router/interfaces'

import type {ServerResponse} from 'http'
import AbstractLocation from 'modern-router/AbstractLocation'
import type {LocationCallback} from 'modern-router/AbstractLocation'
import Callbacks from 'modern-router/Callbacks'

import {parse} from 'url'

interface Req {
    method: string;
    url: string;
    headers: Object;
}

const isHtml = new RegExp('/html')
const isJson = new RegExp('/json')

function formatFromContentType(contentType?: string): ContentFormat {
    if (!contentType) {
        return 'html'
    }
    if (isHtml.test(contentType)) {
        return 'html'
    }
    if (isJson.test(contentType)) {
        return 'json'
    }
    return 'html'
}

export default class RawHttpServerLocation extends AbstractLocation {
    _req: Req
    _res: ServerResponse

    _protocol: string
    _isTrustedProxy: boolean
    _callbacks: Callbacks<LocationData> = new Callbacks()

    constructor(
        req: Req,
        res: ServerResponse,
        isHttps?: boolean = false,
        isTrustedProxy?: boolean = true
    ) {
        super()
        this._req = req
        this._res = res
        this._protocol = isHttps ? 'https' : 'http'
        this._isTrustedProxy = isTrustedProxy
    }

    _next(): void {
        const data = this.getParams()
        this._callbacks.next(data)
    }

    dispose(): void {
        this._callbacks.dispose()
    }

    onChange(fn: LocationCallback): () => void {
        fn(this.getParams())
        return this._callbacks.onChange(fn)
    }

    replace(url: string): void {
        this.redirect(url)
    }

    redirect(url: string): void {
        this._res.writeHead(301, {
            Location: url
        })
        this._res.end()
    }

    redirectPost(url: string, params?: {
        [id: string]: string
    } = {}): void {
        const p = params || {}
        this._res.end(
            `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>redirect</title>
                </head>
                <body>
                    <form id="modern-router-redirect" method="post" action="${url}">
                        ${Object.keys(p).map((key: string) =>
                            `<input name="${key}" type="hidden" value=${p[key]}>`
                        ).join('\n')}
                    </form>
                    <script>
                        document.getElementById('modern-router-redirect').submit()
                    </script>
                </body>
            </html>`
        )
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
            : headers.host

        // IPv6 literal support
        const offset: number = host[0] === '['
            ? host.indexOf(']') + 1
            : 0

        const index: number = host.indexOf(':', offset)

        const hostname: string = index !== -1
            ? host.substring(0, index)
            : host

        const port: string = index !== -1
            ? host.substring(index + 1)
            : ''

        const protocol: string = this._isTrustedProxy
            ? (headers['x-forwared-proto'] || this._protocol)
            : this._protocol

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
            format: formatFromContentType(req.headers['content-type']),
            method: req.method
        }

        return result
    }
}
if (0) (new RawHttpServerLocation(...(0: any)): AbstractLocation) // eslint-disable-line
