/* @flow */
import Observable from 'zen-observable'

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
    _observer: SubscriptionObserver;

    changes: Observable<string, void>;

    constructor(
        history: History,
        redirector: Redirector,
        router: Router
    ) {
        this._history = history
        this._router = router
        this._redirector = redirector

        this.changes = new Observable((observer: SubscriptionObserver) => {
            this._observer = observer
        })
    }

    _getParams(pageName: ?string, state: ?QueryMap, replaceQuery: boolean): {
        query: QueryMap,
        name: string,
        url: string,
        isReplace: boolean,
        isExternal: boolean
    } {
        const route: Route = this._router.resolve() || defaultRoute;
        const name: string = pageName || route.page;
        const st: QueryMap = state || {};
        const query: QueryMap = replaceQuery
            ? st
            : {
                ...route.query,
                ...st
            };
        const data: RouteData = this._router.getData(name);

        return {
            // Query already in url
            query: {},
            name,
            url: this._router.build(name, query),
            isExternal: data.isExternal,
            isReplace: data.isReplace
        }
    }

    set(pageName: ?string, state?: QueryMap, replaceState: boolean = true): void {
        const {
            query,
            name,
            url,
            isReplace,
            isExternal
        } = this._getParams(pageName, state, replaceState)

        if (isReplace) {
            if (isExternal) {
                this._redirector.replace(url)
            } else {
                this._history.replaceState(query, name, url)
                this._observer.next(url)
            }
        } else {
            if (isExternal) {
                this._redirector.redirect(url)
            } else {
                this._history.pushState(query, name, url)
                this._observer.next(url)
            }
        }
    }

    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }
}
