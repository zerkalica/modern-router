/* @flow */

import type {
    Route as IRoute,
    QueryMap,
    RouteData
} from 'modern-router'

import symbolObservable from 'symbol-observable'

export default class Route {
    page: ?string;
    query: QueryMap;
    data: RouteData;

    constructor(
        page: ?string,
        query: ?QueryMap,
        data?: RouteData,
        observable?: Observable<IRoute, Error>
    ) {
        this.page = page || null
        this.query = query || {}
        this.data = data || {
            isExternal: false,
            isReplace: false
        }
        if (observable) {
            (this: Object)[symbolObservable] = () => observable
        }
    }
}
