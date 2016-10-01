modern-router
-------------

Simple separation concerns client/server router, based on [susanin](https://github.com/nodules/susanin).

Need Observable polyfill, use [zen-observable](https://github.com/zenparsing/zen-observable) or [core-js](https://github.com/zloirock/core-js).

## Why not ... router

1. Router should't be depended on buzzname-framework, like [react-router-redux](https://github.com/reactjs/react-router-redux), [react-router](https://github.com/reactjs/react-router), [express](https://github.com/expressjs/express)
2. Should be isolated from server/client realization via custom adapters
3. Pattern-matching engine should be separated from router core
4. Rules should be separated from code: they can't accept callbacks in configuration, only serializable json
5. Same rules for server and client
6. Rules should be matched by url, method, hostname, port, protocol, accept header
7. Router should be reversable (build url string from route name and parameters)
8. Router can build urls to external resources
9. Router should handle redirects to external resources, pushState on client side

Client usage
------------

```js
// @flow
/* eslint-env browser */
/* eslint-disable no-console */

import {SusaninRouter, RouterManager} from 'modern-router/index'
import {BrowserLocation} from 'modern-router/browser'
import type {IRoute} from 'modern-router/index'
import type {IRouterConfig} from 'modern-router/interfaces'

const location = new BrowserLocation(window)
const config: IRouterConfig = {
    isFull: false,
    routes: {
        index: {
            pattern: '/'
        },
        'main.simple': {
            pattern: '/page1'
        },
        'main.full': {
            isFull: true,
            pattern: '/page2'
        },
        'main.index.complex': {
            pattern: '/(<controller>(/<action>(/<id>)))',
            method: 'GET',
            conditions: {
                controller: ['index', 'crud'],
                action: ['build', 'some'],
                id: '\\d{3,4}'
            },
            defaults: {
                controller: 'index',
                action: 'build'
            }
        },
        'some.external': {
            pattern: '/(<controller>)',
            hostname: 'example.com',
            port: '88',
            protocol: 'https:'
        }
    }
}

const rm = new RouterManager(
    location,
    new SusaninRouter(config, location.getParams())
)

rm.onChange((route: IRoute) => {
    console.log('page=', route.page, ', query=', route.query)
})

rm.update('main.index.complex', {
    controller: 'index',
    action: 'build',
    id: '1',
    some: 'a'
});
// page=MyPageWidget, query={controller: 'index', action: 'build', some: 'a', id: '1'}
// browser url /index/build/1?some=a

rm.update(null, {
    controller: 'main'
})
// page=MyPageWidget, query={controller: 'main', action: 'build', some: 'a', id: '1'}
// browser url /main/build/1?some=a

rm.set('main.simple', {id: '1'})
// page=MyPage1, query={id: '1'}
// browser url /page1?id=1

rm.update(null, {id: '2'})
// page=MyPage1, query={id: '2'}
// browser url /page1?&id=2

rm.update('main.simple2')
// page=MyPage2, query={id: '2'}
// browser url http://localhost/page2?id=2

rm.set('some.external', {
    controller: 'index'
}); // window.location.href = https://example.com:88/index

const url: string = rm.build('main.index.complex', {
    controller: 'base',
    action: 'main',
    id: '2'
}); // /base/main/2

rm.build('some.external', {
    controller: 'main'
}) // https://example.com:88/main

```

Server usage
------------

```js
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
```

Interfaces
----------

```js
export type QueryMap = {[id: string]: (string | string[])}

export interface RouterManager {
    /**
     * Build url by page id and params
     *
     * @param  name:    string        Page id
     * @param  params?: QueryMap      page params
     * @return url
     */
    build(name: string, params?: QueryMap): string;

    /**
     * Set location or redirect on server side
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
    set(pageName: ?string, state?: QueryMap): void;

    /**
     * Update params or page url, based on current route
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
    update(pageName: ?string, state?: QueryMap): void;

    /**
     * Invoke callback on location changes
     */
    onChange(fn: (route: IRoute) => void): () => void;
}
```

### Configuration

```js

type SimpleMap<V, K> = {[id: V]: K};

export interface RouteConfig {
    /**
     * Route pattern
     *
     * @example
     * /(<controller>(/<action>(/<id>)))
     *
     * @see https://github.com/nodules/susanin
     */
    pattern: string;

    /**
     * Default values for pattern
     *
     * @example
     * ```js
     * defaults: {
     *    controller : 'index',
     *    action : 'build'
     * }
     * ```
     */
    defaults?: SimpleMap<string, string>;

    /**
     * Conditions regexp map for pattern matching
     *
     * @example
     * ```js
     * conditions: {
     *    id : '\\d{3,4}',
     * }
     * ```
     */
    conditions?: SimpleMap<string, string | string[]>;

    /**
     * Internal page id
     */
    page?: string;

    /**
     * Page matching parameters
     */

     /**
      * Generate full url or not, overrides isFull in RouterConfig
      */
     isFull?: boolean;

     /**
      * On client do location.replaceState or location.pushState
      */
     isReplace?: boolean;

     /**
      * Match route by hostnamePageMap
      *
      * On server side, if one server on multiple hosts
      */
     hostname?: string;

     /**
      * Match route by port
      *
      * On server side, if one configuration on multiple servers
      */
     port?: string;

     /**
      * Match route by protocol
      *
      * On server side, if one configuration on multiple servers
      */
     protocol?: string;

     /**
      * Match route by http method
      *
      * On server side
      */
     method?: string;
}

export interface IRouterConfig {
    /**
     * Generate full url by default ?
     */
    isFull?: boolean;

    /**
     * Route map
     */
    routes: SimpleMap<string, RouteConfig>;
}
```

## Run examples

Browser example:

```bash
npm install
npm run example.browser
```

Server example:

```bash
npm run example.server
```
