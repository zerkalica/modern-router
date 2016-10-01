/* @flow */
import type {
    IRoute,
    QueryMap,
    Router,
    RouteData,
    LocationData,
    IRouterManager
} from 'modern-router/interfaces'

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import AbstractLocation from 'modern-router/AbstractLocation'

interface Params {
    query: QueryMap,
    name: string,
    url: string,
    isReplace: boolean,
    isExternal: boolean
}

export type RouterCallback = (route: IRoute) => void

export default class RouterManager {
    _router: Router
    _currentRoute: ?IRoute
    _location: AbstractLocation

    constructor(
        location: AbstractLocation,
        router: Router
    ) {
        this._router = router
        this._location = location
    }

    dispose(): void {
        this._location.dispose()
    }

    _getParams(pageName: ?string, state: ?QueryMap, replaceQuery: boolean): ?Params {
        const route: ?IRoute = pageName
            ? this._router.getRouteByName(pageName)
            : this._currentRoute

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
            }
            return
        }

        if (isExternal) {
            this._location.redirect(url)
        } else {
            this._location.pushState(query, name, url)
        }
    }

    onChange(fn: (route: IRoute) => void): () => void {
        const locationToRoute = (data: LocationData) => {
            this._currentRoute = this._router.find(data)
            return fn(this._currentRoute)
        }

        return this._location.onChange(locationToRoute)
    }

    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }

    build(name: string, params?: QueryMap = {}): string {
        return this._router.build(name, params)
    }
}

if (0) (new RouterManager(...(0: any)): IRouterManager) // eslint-disable-line
