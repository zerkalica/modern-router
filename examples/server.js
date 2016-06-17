/* @flow */
/* eslint-env node */
/* eslint-disable no-console */

import http from 'http'

import type {ServerResponse} from 'modern-router/i/fixes'
import type {IncomingMessage} from 'http'

import {
    RawHttpServerLocation,
    ServerRouterManagerFactory
} from 'modern-router/server'
import type {
    Route,
    RouterConfig,
    RouterManager
} from 'modern-router'

const config: RouterConfig = {
    routes: {
        'main.simple': {
            pattern: '/page1',
            page: 'MyPage1'
        },
        'main.simple2': {
            isFull: true,
            pattern: '/page2',
            page: 'MyPage2'
        }
    }
}

const serverRouterManagerFactory = new ServerRouterManagerFactory(config)

http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const routerManager: RouterManager = serverRouterManagerFactory.create(
        new RawHttpServerLocation((req: any), res)
    )
    const route: ?Route = routerManager.route
    if (!route) {
        res.writeHead(404)
        res.end('Page not found')
    }
    res.end(JSON.stringify(route))
}).listen(8080)

console.log('Server started at https://localhost:8080/')
