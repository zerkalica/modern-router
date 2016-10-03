/* @flow */

import type {
    QueryMap,
    RouteData
} from 'modern-router/interfaces'

export default class Route {
    page: ?string
    query: QueryMap
    data: RouteData

    constructor(
        page?: ?string,
        query?: ?QueryMap,
        data?: RouteData
    ) {
        this.page = page || null
        this.query = query || {}
        this.data = data || {
            isExternal: false,
            isReplace: false
        }
    }
}
