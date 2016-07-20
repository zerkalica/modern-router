/* @flow */
import type {
    IRoute,
    QueryMap,
    Router,
    RouteData,
    IRouterManager
} from 'modern-router/interfaces'

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import {ObserverBroker} from 'observable-helpers'
import AbstractLocation from 'modern-router/AbstractLocation'

class LocationObserver {
    _setLocation: (location: AbstractLocation) => void;
    _observer: SubscriptionObserver<IRoute, Error>;

    constructor(
        setLocation: (location: AbstractLocation) => void,
        observer: SubscriptionObserver<IRoute, Error>
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
if (0) (new LocationObserver(...(0: any)): Observer<AbstractLocation, Error>) // eslint-disable-line

interface Params {
    query: QueryMap,
    name: string,
    url: string,
    isReplace: boolean,
    isExternal: boolean
}

export default class RouterManager {
    _router: Router;
    _location: AbstractLocation;
    _observable: Observable<IRoute, Error>;
    _observer: SubscriptionObserver<IRoute, Error>;
    _subscription: Subscription;

    route: IRoute;

    constructor(
        location: AbstractLocation,
        router: Router
    ) {
        this._router = router
        this._location = location

        const broker = new ObserverBroker()
        this._observer = broker
        this._observable = broker.observable
        this._subscription = Observable.from(location).subscribe(
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

    _getParams(pageName: ?string, state: ?QueryMap, replaceQuery: boolean): ?Params {
        const route: IRoute = this._resolve()
        if (!route) {
            return null
        }
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
        const params: ?Params = this._getParams(pageName, state, replaceState)
        if (!params) {
            throw new PageNotFoundError(pageName)
        }

        const {query, name, url, isReplace, isExternal} = params

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

    _resolve(): IRoute {
        return this._router.find(this._location.getParams(), this._observable)
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

if (0) (new RouterManager(...(0: any)): IRouterManager) // eslint-disable-line
