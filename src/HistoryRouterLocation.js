/* @flow */

import type {
    QueryMap,
    Router,
    Route,
    Redirector,
    RouterLocation // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

const defaultRoute: Route = {
    page: '',
    query: {}
};

// implements RouterLocation
export default class HistoryRouterLocation {
    _history: History;
    _router: Router;
    _redirector: Redirector;

    constructor(
        history: History,
        redirector: Redirector,
        router: Router
    ) {
        this._history = history
        this._router = router
        this._redirector = redirector
    }

    _getParams(pageName: ?string, state: ?QueryMap, replaceQuery: boolean): {
        query: QueryMap,
        name: string,
        url: string,
        isExternal: boolean
    } {
        const route: Route = this._router.resolve() || defaultRoute;
        const name: string = pageName || route.page;
        const query: QueryMap = replaceQuery
            ? state || {}
            : {
                ...state || {},
                ...route.query
            };
        return {
            // Query already in url
            query: {},
            name,
            url: this._router.build(name, query),
            isExternal: this._router.isExternal(name)
        }
    }

    pushState(pageName: ?string, state?: QueryMap, replaceQuery: boolean = true): void {
        const {query, name, url, isExternal} = this._getParams(pageName, state, replaceQuery)
        if (isExternal) {
            this._redirector.redirect(url)
        } else {
            this._history.pushState(query, name, url)
        }
    }

    replaceState(pageName: ?string, state?: QueryMap, replaceQuery: boolean = true): void {
        const {query, name, url, isExternal} = this._getParams(pageName, state, replaceQuery)
        if (isExternal) {
            this._redirector.replace(url)
        } else {
            this._history.replaceState(query, name, url)
        }
    }
}
