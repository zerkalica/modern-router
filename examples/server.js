/* @flow */
/* eslint-env node */
/* eslint-disable no-console */

import http from 'http'

import type {ServerResponse} from 'modern-router/server'
import type {IncomingMessage} from 'http'

import {RawHttpServerLocation} from 'modern-router/server'

import type {
    LocationData,
    IRoute,
    RouterManager
} from 'modern-router/index'

import {
    SusaninRouter,
    RouterManagerFactory,
    RouterConfig
} from 'modern-router/index'

const config: RouterConfig = new RouterConfig({
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
})

const serverRouterManagerFactory = new RouterManagerFactory(
    (params: LocationData) => new SusaninRouter(config, params)
)

http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const routerManager: RouterManager = serverRouterManagerFactory.create(
        new RawHttpServerLocation((req: any), res)
    )
    const route: ?IRoute = routerManager.route
    if (!route) {
        res.writeHead(404)
        res.end('Page not found')
    }
    res.end(JSON.stringify(route))
}).listen(8080)

console.log('Server started at https://localhost:8080/')
