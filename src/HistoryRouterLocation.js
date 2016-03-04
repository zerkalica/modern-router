/* @flow */

import type {
    QueryMap,
    Router,
    RouteData,
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
        data: RouteData
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
            data: this._router.getData(name)
        }
    }

    set(pageName: ?string, state?: QueryMap, replaceState: boolean = true): void {
        const {query, name, url, data} = this._getParams(pageName, state, replaceState)
        if (data.isReplace) {
            if (data.isExternal) {
                this._redirector.replace(url)
            } else {
                this._history.replaceState(query, name, url)
            }
        } else {
            if (data.isExternal) {
                this._redirector.redirect(url)
            } else {
                this._history.pushState(query, name, url)
            }
        }
    }

    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }
}
