/* @flow */
import type {
    Route,
    QueryMap,
    Router,
    RouteData,
    AbstractLocation,
    RouterManager // eslint-disable-line
} from 'modern-router'

import {ObserverBroker} from 'observable-helpers'
import RouteImpl from 'modern-router/Route'

const defaultRoute: Route = (new RouteImpl(): any)

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
        this._setLocation(location)
    }

    complete(): void {
        this._observer.complete()
    }

    error(err: Error): void {
        this._observer.error(err)
    }
}

// implements RouterManager
export default class DefaultRouterManager {
    _router: Router;
    _location: AbstractLocation;
    _observable: Observable<Route, Error>;
    _observer: SubscriptionObserver<Route, Error>;
    _subscription: Subscription;

    route: Route;

    constructor(
        location: AbstractLocation,
        router: Router,
        observableLocation: Observable<AbstractLocation, Error>
    ) {
        this._router = router
        this._location = location

        const broker = new ObserverBroker()
        this._observer = broker
        this._observable = broker.observable
        this._subscription = observableLocation.subscribe(
            new LocationObserver(
                (loc: AbstractLocation) => {
                    this._location = loc
                    this._next()
                },
                this._observer
            )
        )
        this.route = this._resolve()
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
        const route: Route = this._resolve()
        const name: string = pageName || route.page || ''
        const st: QueryMap = state || {}
        const query: QueryMap = replaceQuery
            ? st
            : {
                ...route.query,
                ...st
            }
        const data: RouteData = route.data

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

    _resolve(): Route {
        return this._router.find(this._location.getParams(), this._observable) || defaultRoute
    }

    _next(): void {
        this.route = this._resolve()
        this._observer.next(this.route)
    }

    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }

    build(name: string, params?: QueryMap = {}): string {
        return this._router.build(name, params)
    }
}
