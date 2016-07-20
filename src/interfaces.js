/* @flow */

export type SimpleMap<V, K> = {[id: V]: K};

/**
 * Page matching parameters
 */
export interface RouteConfigData {
    /**
     * Generate full url or not, overrides isFull in RouterConfig
     */
    isFull?: boolean;

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
}

export interface RouteConfig {
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
    conditions?: SimpleMap<string, string|string[]>;

    /**
     * Internal page id
     */
    page?: string;

    /**
     * Page matching parameters
     */
    data?: RouteConfigData;
}

export interface RouteConfigProps {
    /**
     * Generate full url by default ?
     */
    isFull?: boolean;

    /**
     * Route map
     */
    routes?: SimpleMap<string, RouteConfig>;
}


export type QueryMap = SimpleMap<string, string|string[]>;

export interface LocationDataBase {
    hostname: string;
    port: ?string;
    protocol: string;
    method: string;
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

export interface IRoute {
    page: ?string;
    query: QueryMap;
    data: RouteData;
}

export interface Router {
    find(options: LocationData): IRoute;
    build(name: string, params?: QueryMap): string;
}

export type CreateRouter = (params: LocationData) => Router
export type GetKey = (params: LocationData) => string

export interface IRouterManager {
    /**
     * Parsed observable route
     */
    route: IRoute;

    /**
     * Build url by page id and params
     *
     * @param  name:    string        Page id
     * @param  params?: QueryMap      page params
     * @return url
     */
    build(name: string, params?: QueryMap): string;

    /**
     * Set location or redirect on server side
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
    set(pageName: ?string, state?: QueryMap): void;
    update(pageName: ?string, state?: QueryMap): void;
}

export interface PageRec<Widget, Component> {
    ErrorPage: Widget;
    FallbackPage: Component;
    pages: {
        [id: string]: Widget;
    }
}
