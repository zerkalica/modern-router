/* @flow */

import type {
    QueryMap,
    RouteData
} from './interfaces'
import shallowEqual from './shallowEqual'

export type IRouteOpts = {
    page?: ?string,
    name?: ?string,
    query?: ?QueryMap,
    data?: RouteData
}

function mergeQuery(oldQuery: Object, newQuery: Object): Object {
    const result = {}

    const keys = Object.keys(oldQuery).concat(Object.keys(newQuery))
    for (let i = 0, l = keys.length; i < l; i++) {
        const k = keys[i]
        const newValue = newQuery[k]
        if (newValue !== null) {
            result[k] = newValue === undefined ? oldQuery[k] : newValue
        }
    }

    return result
}

export default class Route {
    page: ?string
    name: string
    query: QueryMap
    data: RouteData

    constructor(rec?: IRouteOpts = {}) {
        this.page = rec.page || null
        this.name = rec.name || ''
        this.query = rec.query || {}
        this.data = rec.data || {
            isExternal: false,
            isReplace: false
        }
    }

    copy(rec: IRouteOpts): Route {
        return rec.page === this.page
            && rec.name === this.name
            && shallowEqual(rec.query, this.query)
            && shallowEqual(rec.data, this.data)
                ? this
                : new Route({
                    ...this,
                    ...rec,
                    query: mergeQuery(this.query, rec.query || {})
                })
    }
}
