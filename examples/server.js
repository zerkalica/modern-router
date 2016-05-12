/* @flow */
/* eslint-env node */
/* eslint-disable no-console */

import http from 'http'
import {
    RawHttpServerLocation,
    createServerRouterManager
} from 'modern-router/server'
import type {
    ServerResponse,
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
};


http.createServer((req: http$IncomingMessage, res: ServerResponse) => {
    const routerManager: RouterManager = createServerRouterManager(
        new RawHttpServerLocation((req: any), res),
        config
    );
    const route: Route = routerManager.resolve();
    // console.log(route)
    if (!route.page) {
        res.writeHeader(404)
        res.end(route.page ? '' : 'Page not found')
    }
    res.end(JSON.stringify(route))
}).listen(8080)

console.log('Server started at https://localhost:8080/')
