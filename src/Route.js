/* @flow */

import type {
    QueryMap
} from 'modern-router/i/routerInterfaces'

export default class Route {
    page: ?string;
    query: QueryMap;

    constructor(
        page: ?string,
        query: ?QueryMap
    ) {
        this.page = page || null
        this.query = query || {}
    }
}
