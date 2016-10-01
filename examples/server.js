/* @flow */
/* eslint-env node */
/* eslint-disable no-console */

import http from 'http'

import type {IncomingMessage, ServerResponse} from 'http'

import {RawHttpServerLocation} from 'modern-router/server'

import type {RouterManager} from 'modern-router/index'

import {createRouterFactory} from 'modern-router/index'

const config = {
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

const rf = createRouterFactory(config)

http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const routerManager: RouterManager = rf(
        new RawHttpServerLocation((req: any), res)
    )
    routerManager.onChange((route) => {
        if (!route.page) {
            res.writeHead(404)
            res.end(`
                <a href="/page1">main.simple</a>
                <a href="/page2">main.simple2</a>
            `)
        }
        res.end(JSON.stringify(route))
        routerManager.dispose()
    })
}).listen(8080)

console.log('Server started at https://localhost:8080/')
