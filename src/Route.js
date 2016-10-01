/* @flow */

import type {
    IRoute,
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
if (0) (new Route(...(0: any)): IRoute) // eslint-disable-line
