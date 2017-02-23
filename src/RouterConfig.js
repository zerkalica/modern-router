/* @flow */

import type {
    SimpleMap,
    RouteConfig,
    IRouterConfig
} from './interfaces'

/**
 * Normalized router config class
 */
export default class RouterConfig implements IRouterConfig {
    isFull: boolean
    routes: SimpleMap<string, RouteConfig>
    prefix: string

    constructor(rec: IRouterConfig) {
        this.isFull = rec.isFull || false
        this.routes = rec.routes || {}
        this.prefix = rec.prefix || ''
    }
}
