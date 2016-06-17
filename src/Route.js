/* @flow */

import type {
    QueryMap,
    RouteData
} from 'modern-router'

export default class Route {
    page: string;
    query: QueryMap;
    data: RouteData;

    constructor(
        page: string,
        query: ?QueryMap,
        data?: RouteData,
        observable?: Observable<Route, Error>
    ) {
        this.page = page
        this.query = query || {}
        this.data = data || {
            isExternal: false,
            isReplace: false
        }
        if (observable) {
            (this: Object)[Symbol.observable] = () => observable
        }
    }
}
