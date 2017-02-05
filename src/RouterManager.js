/* @flow */
import type {
    QueryMap,
    Router,
    RouteData,
    LocationData
} from 'modern-router/interfaces'

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import AbstractLocation from 'modern-router/AbstractLocation'
import Route from 'modern-router/Route'

interface Params {
    query: QueryMap,
    name: string,
    url: string,
    isReplace: boolean,
    isExternal: boolean
}

export type RouterCallback = (route: Route) => void

/**
 * Router manager
 */
export default class RouterManager {
    _router: Router
    _currentRoute: ?Route
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
        const cr = this._currentRoute
        const route: ?Route = pageName
            ? this._router.getRouteByName(pageName)
            : cr

        if (!route) {
            return null
        }
        const name: string = pageName || route.name || ''
        const st: QueryMap = state || {}
        const query: QueryMap = replaceQuery
            ? st
            : {
                ...(cr ? cr.query : {}),
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

    /**
     * Set location or redirect on server side
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
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

    /**
     * Invoke callback on location changes
     */
    onChange(fn: RouterCallback): () => void {
        const locationToRoute = (data: LocationData) => {
            this._currentRoute = this._router.find(data)
            return fn(this._currentRoute)
        }

        return this._location.onChange(locationToRoute)
    }

    /**
     * Update params or page url, based on current route
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
    update(pageName: ?string, state?: QueryMap): void {
        this.set(pageName, state, false)
    }

    /**
     * Build url by page id and params
     *
     * @param  name:    string        Page id
     * @param  params?: QueryMap      page params
     * @return url
     */
    build(name: string, params?: QueryMap = {}): string {
        return this._router.build(name, params)
    }
}
