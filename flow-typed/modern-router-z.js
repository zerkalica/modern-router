/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

declare module 'modern-router' {
    declare type QueryMap = SimpleMap<string, string|string[]>;

    /**
     * Page matching parameters
     */
    declare interface RouteConfigData {
        /**
         * Generate full url or not, overrides isFull in RouterConfig
         */
        isFull?: boolean;

        /**
         * On client do location.replaceState or location.pushState
         */
        isReplace?: boolean;

        /**
         * Match route by hostname
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

    declare interface RouteConfig {
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

    declare interface RouterConfig {
        /**
         * Generate full url by default ?
         */
        isFull?: boolean;

        /**
         * Route map
         */
        routes: SimpleMap<string, RouteConfig>;
    }

    declare interface LocationDataBase {
        hostname: string;
        port: ?string;
        protocol: string;
        method: string;
    }

    declare interface LocationData extends LocationDataBase {
        pathname: string;
        search: string;
    }

    declare interface RouteData {
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

    declare interface Route {
        page: string;
        query: QueryMap;
        data: RouteData;

        constructor(
            page: string,
            query: ?QueryMap,
            data?: RouteData,
            observable?: Observable<Route, Error>
        ): Route;
    }

    declare interface Router {
        find(options: LocationData): ?Route;
        build(name: string, params?: QueryMap): string;
    }

    declare interface RouterManager {
        route: ?Route;
        build(name: string, params?: QueryMap): string;
        set(pageName: ?string, state?: QueryMap): void;
        update(pageName: ?string, state?: QueryMap): void;
    }

    declare type GetKey = (data: LocationData) => string;

    declare type Renderer<Element, Widget> = (widget: Widget, error:? Error) => Element;
    declare type PageMap<Widget> = {[id: string]: Widget};

    declare class AbstractLocation mixins $ObservableObject<AbstractLocation, Error> {
        redirect(url: string): void;
        replace(url: string): void;
        getParams(): LocationData;
        pushState(query: QueryMap, name: string, url: string): void;
        replaceState(query: QueryMap, name: string, url: string): void;
    }

    declare class PageNotFoundError extends Error {
        pageName: ?string;

        constructor(
            pageName?: ?string,
            message?: string
        ): PageNotFoundError;
    }

    declare class RouterObserver<Element, Widget> extends SubscriptionObserver<Route, Error> {
        constructor(
            renderer: Renderer<Element, Widget>,
            pages: PageMap<Widget>,
            ErrorPage: Widget
        ): RouterObserver;
    }
}
