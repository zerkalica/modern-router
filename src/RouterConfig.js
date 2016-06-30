/* @flow */

import type {
    SimpleMap,
    RouteConfig,
    RouteConfigProps
} from 'modern-router/interfaces'

/**
 * Normalized router config class
 */
export default class RouterConfig {
    isFull: boolean;
    routes: SimpleMap<string, RouteConfig>;

    constructor(rec: RouteConfigProps) {
        this.isFull = rec.isFull || false
        this.routes = rec.routes || {}
    }
}
