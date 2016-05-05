/* @flow */
import Observable from 'zen-observable'

import type {
    QueryMap,
    Router,
    RouteData,
    AbstractLocation,
    RouterManager // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

import AbstractRouterManager from 'modern-router/AbstractRouterManager'
import {ObserverBroker} from 'observable-helpers'
import Route from 'modern-router/Route'

const defaultRoute = new Route();

class LocationObserver {
    _setLocation: (location: AbstractLocation) => void;
    _observer: SubscriptionObserver<Route, Error>;

    constructor(
        setLocation: (location: AbstractLocation) => void,
        observer: SubscriptionObserver<Route, Error>
    ) {
        this._setLocation = setLocation
        this._observer = observer
    }

    next(location: AbstractLocation): void {
        this._setLocation.setLocation(location)
    }

    complete(): void {
        this._observer.complete()
    }

    error(err: Error): void {
        this._observer.error(err)
    }
}

// implements RouterManager
export default class DefaultRouterManager extends AbstractRouterManager {
    _router: Router;
    _location: AbstractLocation;
    _observer: SubscriptionObserver<Route, Error>;
    _subscription: Subscription;

    changes: Observable<Route, Error>;

    constructor(
        location: AbstractLocation,
        router: Router,
        observableLocation: Observable<AbstractLocation, Error>
    ) {
        super()
        this._router = router
        this._location = location

        const broker = new ObserverBroker()
        this._observer = broker
        this.changes = broker.observable

        const self = this

        function setLocation(loc: AbstractLocation): void {
            self._location = loc
            self._next()
        }

        this._subscription = observableLocation.subscribe(
            new LocationObserver(setLocation, this._observer)
        )
    }

    dispose(): void {
        this._subscription.unsubscribe()
        this._observer.complete()
    }

    _getParams(pageName: ?string, state: ?QueryMap, replaceQuery: boolean): {
        query: QueryMap,
        name: string,
        url: string,
        isReplace: boolean,
        isExternal: boolean
    } {
        const route: Route = this.resolve() || defaultRoute;
        const name: string = pageName || route.page || '';
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
                this._location.replace(url)
            } else {
                this._location.replaceState(query, name, url)
                this._next()
            }
        } else {
            if (isExternal) {
                this._location.redirect(url)
            } else {
                this._location.pushState(query, name, url)
                this._next()
            }
        }
    }

    _next(): void {
        this._observer.next(this.resolve())
    }

    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }

    resolve(): Route {
        return this._router.find(this._location.getParams())
    }

    build(name: string, params?: QueryMap = {}): string {
        return this._router.build(name, params)
    }
}
