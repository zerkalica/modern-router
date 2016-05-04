/* @flow */
/* eslint-env node */
/* eslint-disable no-console */

import http from 'http'
import {createServerRouterManager} from 'modern-router/../server'
import type {
    RouteConfig
} from 'modern-router/i/routerInterfaces'

const config: RouteConfig = {
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


http.createServer((req, res) => {
    const routerManager = createServerRouterManager(req, res, config)
    const route = routerManager.resolve()
    console.log(route)
}).listen(8080)

console.log('Server started at https://localhost:8080/')
