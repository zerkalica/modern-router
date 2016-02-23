/* @flow */

import type {
    QueryMap,
    Router,
    Route,
    Redirector,
    RouterLocation // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

// implements RouterLocation
export default class RouterLocationImpl {
    isDisposed: boolean;

    _history: History;
    _router: Router;
    _currentRoute: Route;
    _subscription: Subscription;
    _redirector: Redirector;

    constructor(
        history: History,
        locationChanges: Observable<?Route, void>,
        redirector: Redirector,
        router: Router
    ) {
        this._history = history
        this._router = router
        this._redirector = redirector
        const currentRoute: Route = this._currentRoute = {
            page: '',
            query: {}
        };
        this._subscription = locationChanges.subscribe({
            next(rec: ?Route) { // eslint-disable-line
                if (rec) {
                    currentRoute.page = rec.page
                    currentRoute.query = rec.query
                }
            },
            error() {},
            complete() {}
        })
        this.isDisposed = false
    }

    dispose(): void {
        this._subscription.unsubscribe()
        this.isDisposed = true
    }

    _getParams(pageName: ?string, state: ?QueryMap): {
        query: QueryMap,
        name: string,
        url: string,
        isExternal: boolean
    } {
        const name: string = pageName || this._currentRoute.page;
        const query: QueryMap = state || this._currentRoute.query;
        const {url, isExternal} = this._router.getRoute(name, query);

        return {
            // Query already in url
            query: {},
            name,
            url,
            isExternal
        }
    }

    pushState(pageName: ?string, state?: QueryMap): void {
        const {query, name, url, isExternal} = this._getParams(pageName, state)
        if (isExternal) {
            this._redirector.redirect(url)
        } else {
            this._history.pushState(query, name, url)
        }
    }

    replaceState(pageName: ?string, state?: QueryMap): void {
        const {query, name, url, isExternal} = this._getParams(pageName, state)
        if (isExternal) {
            this._redirector.replace(url)
        } else {
            this._history.replaceState(query, name, url)
        }
    }
}
