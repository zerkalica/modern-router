/* @flow */

import type {
    SimpleMap,
    RouteConfig,
    IRouterConfig
} from 'modern-router/interfaces'

/**
 * Normalized router config class
 */
export default class RouterConfig {
    isFull: boolean
    routes: SimpleMap<string, RouteConfig>
    prefix: string

    constructor(rec: IRouterConfig) {
        this.isFull = rec.isFull || false
        this.routes = rec.routes || {}
        this.prefix = rec.prefix || ''
    }
}
if (0) (new RouterConfig(...(0: any)): IRouterConfig) // eslint-disable-line
