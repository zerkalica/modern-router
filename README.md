modern-router
-------------

Simple separation concerns client/server router, based on susanin

Features
--------

-	Can be adapted for client or server
-	Can build url from route name
-	Can handle external redirects
-	Config based, [susanin](https://github.com/nodules/susanin) used as pattern matching engine
-	Modular, used [zen-observable](https://github.com/zenparsing/zen-observable) for adapt location changes
-	Modern, used [flowtype](http://flowtype.org), [babel](http://babeljs.io)
-	Can be used with old ie browsers with [HTML5-History-API](https://github.com/devote/HTML5-History-API) polyfill

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

rm.update('main.simple')
// page=MyPage1, query={controller: 'main', action: 'build', some: 'a', id: '1'}
// browser url /page1?some=a&id=1&controller=main&action=build

rm.set('main.simple')
// page=MyPage1, query={}
// browser url /page1

rm.update('some.external', {
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
