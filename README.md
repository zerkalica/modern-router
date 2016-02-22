reactive-router
---------------

Simple separation concerns client/server router, based on susanin

Features
--------

-	Can be adapted for client or server
-	Can build url from route name
-	Can handle external redirects
-	Config based, (susanin)[https://github.com/nodules/susanin] used as pattern matching engine
-	Modular, used (zen-observable)[https://github.com/zenparsing/zen-observable] for adapt location changes
-	Modern, used (flowtype)[http://flowtype.org], (babel)[http://babeljs.io\]
-	Can be used with old ie browsers with (HTML5-History-API)[https://github.com/devote/HTML5-History-API] polyfill

Example
-------

```js
// @flow
import {
    createLocationChanges,
    HistoryRouterLocation,
    SusaninRouter,
    simpleFromLocation,
    locationRedirector
} from 'reactive-router'
import type {
    Redirector,
    Route,
    RouterLocation,
    SimpleLocation,
    Router,
    RouterConfig
} from 'reactive-router/i/routerInterfaces'

const config: RouterConfig = {
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
};

const redirector: Redirector = locationRedirector(document.location);
const defaultLocation: SimpleLocation = simpleFromLocation(document.location);
const router: Router = new SusaninRouter(config, defaultLocation);
const locationChanges: Observable<Route, void> = createLocationChanges(window, document.location, router);
const location: RouterLocation = new HistoryRouterLocation(
    window.history,
    locationChanges,
    redirector,
    router
);

locationChanges.subscribe({
    next(route: Route) {
        console.log('page=', route.page, ', query=', route.query)
    },
    error() {},
    complete() {}
})

location.pushState('main.index.complex', {
    controller: 'index',
    action: 'build',
    id: '1',
    some: 'a'
});
// page=MyPageWidget, query={controller: 'index', action: 'build', some: 'a', id: '1'}
// browser url /index/build/1?some=a

location.pushState('some.external', {
    controller: 'index'
}); // window.location.href = https://example.com:88/index

const url: string = router.build('main.index.complex', {
    controller: 'base',
    action: 'main',
    id: '2'
}); // /base/main/2

router.build('some.external', {
    controller: 'main'
}) // https://example.com:88/main

```
