/* @flow */

export type SimpleMap<V, K> = {[id: V]: K};

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

export interface IRouterConfig {
    /**
     * Generate full url by default ?
     */
    isFull?: boolean;

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
    getRouteByName(name: string): ?IRoute;
}

export type CreateRouter = (params: LocationData) => Router
export type GetKey = (params: LocationData) => string

export interface IRouterManager {
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

    /**
     * Update params or page url, based on current route
     *
     * @param pageName: ?string  if null - current pagename used
     * @param state?:   QueryMap replace query params in url
     */
    update(pageName: ?string, state?: QueryMap): void;

    /**
     * Invoke callback on location changes
     */
    onChange(fn: (route: IRoute) => void): () => void;
}

export interface PageRec<Widget, Component> {
    ErrorPage: Widget;
    FallbackPage: Component;
    pages: {
        [id: string]: Widget;
    }
}
