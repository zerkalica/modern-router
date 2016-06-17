modern-router
-------------

Simple separation concerns client/server router, based on [susanin](https://github.com/nodules/susanin).

Features
--------

-	Config-based, can be configured from json
-	Reversable: can build url string from route name and parameters
-	Can inherit previous route state: rm.set('page', {id: '1'}); rm.update(null, {id: '2'})
-	Can handle routes to external resources
-	Isomorphic: can be used on client or server side
-	[susanin](https://github.com/nodules/susanin) used as pattern matching engine
-	Needs Observable polyfill for location changes
-	Used [flowtype](http://flowtype.org) definitions
-	Can be used in old ie browsers with [HTML5-History-API](https://github.com/devote/HTML5-History-API) polyfill

Interfaces
----------

```js
interface RouterManager {

    /**
     * Parsed observable route
     * @type {[type]}
     */
    route: Route;

    /**
     * Build url by page id
     *
     * @param  name:    string        Page id
     * @param  params?: QueryMap      page params
     * @return url
     */
    build(name: string, params?: QueryMap): string;
    set(pageName: ?string, state?: QueryMap): void;
    update(pageName: ?string, state?: QueryMap): void;
}
```

### Configuration

```js

type SimpleMap<V, K> = {[id: V]: K};

/**
 * Page matching parameters
 */
declare interface RouteConfigData {
    /**
     * Generate full url or not, overrides isFull in RouterConfig
     */
    isFull?: boolean;

    /**
     * On client do location.replaceState or location.pushState
     */
    isReplace?: boolean;

    /**
     * Match route by hostname
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

declare interface RouteConfig {
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
    conditions?: SimpleMap<string, string|string[]>;

    /**
     * Internal page id
     */
    page?: string;

    /**
     * Page matching parameters
     */
    data?: RouteConfigData;
}

declare interface RouterConfig {
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

Client usage
------------

```js
// @flow
import {
    createBrowserRouterManager
} from 'modern-router/browser'
import type {
    RouterConfig,
    RouterManager
} from 'modern-router'

const config: RouterConfig = {
    // generate full url by default
    isFull: false,
    routes: {
        'main.simple': {
            pattern : '/page1',
            page: 'MyPage1'
        },
        'main.simple2': {
            isFull: true,
            pattern : '/page2',
            page: 'MyPage2'
        },
        'main.index.complex': {
            pattern : '/(<controller>(/<action>(/<id>)))',
            page: 'MyPageWidget',
            data: {
                method: 'GET'
            },
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
            data: {
                hostname: 'example.com',
                port: '88',
                protocol: 'https:'
            }
        }
    }
};

const rm: RouterManager = createBrowserRouterManager(window, config);

Observable.from(rm.route).subscribe({
    next(route: Route) {
        console.log('page=', route.page, ', query=', route.query)
    },
    error() {},
    complete() {}
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
import {
    RawHttpServerLocation,
    createServerRouterManager
} from 'modern-router/server'
import type {
    Route,
    RouteConfig,
    RouterManager
} from 'modern-router'

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


http.createServer((req: http$IncomingMessage, res: http$ServerResponse) => {
    const routerManager: RouterManager = createServerRouterManager(
        new RawHttpServerLocation((req: any), res),
        config
    );
    const route: Route = routerManager.route
    // console.log(route)
    if (!route.page) {
        res.writeHeader(404)
        res.end(route.page ? '' : 'Page not found')
    }
    res.end(JSON.stringify(route))
}).listen(8080)

console.log('Server started at https://localhost:8080/')
```
