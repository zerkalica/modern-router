modern-router
-------------

Simple separation concerns client/server router, based on susanin.

Features
--------

-	Config-based, can be configured from json
-	Build url string from route name and parameters
-	Can inherit previous route state: rm.set('page', {id: '1'}); rm.update(null, {id: '2'})
-	Can handle routes to external resources
-	Can be adapted for client or server
-	[susanin](https://github.com/nodules/susanin) used as pattern matching engine
-	Used [zen-observable](https://github.com/zenparsing/zen-observable) for adapt location changes
-	Used [flowtype](http://flowtype.org), [babel](http://babeljs.io)
-	Can be used in old ie browsers with [HTML5-History-API](https://github.com/devote/HTML5-History-API) polyfill

Example
-------

```js
// @flow
import {
    createBrowserRouterManager
} from 'modern-router'
import type {
    RouterConfig,
    RouterManager
} from 'modern-router/i/routerInterfaces'

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

rm.changes.subscribe({
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
// browser url http://localhost/page2?&id=2

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
