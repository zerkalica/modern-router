/* @flow */

import Route from './Route'

export type SimpleMap<V, K> = {[id: V]: K}

export type ContentFormat = 'html' | 'json'

export type RouteConfig = {
    /**
     * Route pattern
     *
     * @example
     * /(<controller>(/<action>(/<id>)))
     *
     * @see https://github.com/nodules/susanin
     */
    pattern: string;

    /**
     * Default values for pattern
     *
     * @example
     * ```js
     * defaults: {
     *    controller : 'index',
     *    action : 'build'
     * }
     * ```
     */
    defaults?: SimpleMap<string, string>;

    /**
     * Conditions regexp map for pattern matching
     *
     * @example
     * ```js
     * conditions: {
     *    id : '\\d{3,4}',
     * }
     * ```
     */
    conditions?: SimpleMap<string, string | string[]>;

    /**
     * Internal page id
     */
    page?: string;

    /**
     * Page matching parameters
     */

     /**
      * Generate full url or not, overrides isFull in RouterConfig
      */
    isFull?: boolean;

    isExternal?: boolean;


     /**
      * On client do location.replaceState or location.pushState
      */
    isReplace?: boolean;

     /**
      * Match route by hostnamePageMap
      *
      * On server side, if one server on multiple hosts
      */
    hostname?: string;

     /**
      * Match route by port
      *
      * On server side, if one configuration on multiple servers
      */
    port?: string;

     /**
      * Match route by protocol
      *
      * On server side, if one configuration on multiple servers
      */
    protocol?: string;

     /**
      * Match route by http method
      *
      * On server side
      */
    method?: string;

    /**
     * Match route by content-type header
     */
    format?: ContentFormat;
}

export interface IRouterConfig {
    /**
     * Generate full url by default ?
     */
    isFull?: boolean;

    /**
     * All routes prefix
     */
    prefix?: string;

    /**
     * Route map
     */
    routes: SimpleMap<string, RouteConfig>;
}

export type QueryMap = {[id: string]: (string | string[])}

export interface LocationDataBase {
    hostname: string;
    port: ?string;
    protocol: string;
    method: string;
    format: ContentFormat;
}

export interface LocationData extends LocationDataBase {
    pathname: string;
    search: string;
}

export interface RouteData {
    /**
     * Is external route
     * If true - generate full url to external site
     * On client side: do full redirect instead of location.pushState
     */
    isExternal: boolean;

    /**
     * Do replaceState or pushState
     */
    isReplace: boolean;
}

export interface Router {
    find(options: LocationData): Route;
    build(name: string, params?: QueryMap): string;
    getRouteByName(name: string, query?: ?Object): ?Route;
}

export type GetKey = (params: LocationData) => string

export interface PageRec<Widget, Component> {
    ErrorPage: Widget;
    FallbackPage: Component;
    pages: {
        [id: string]: Widget;
    }
}
