/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

declare module 'modern-router' {
    declare type QueryMap = SimpleMap<string, string|Array<string>>;
    /**
     * @example
     'main.index': {
         pattern : '/(<controller>(/<action>(/<id>)))',
         page: 'MyPageWidget',
         data: {
             method: 'GET'
         },
         conditions: {
             controller: [ 'index', 'crud' ],
             action: [ 'build', 'some' ],
             id: '\\d{3,4}'
         },
         defaults: {
             controller: 'index',
             action: 'build'
         }
     }
     * @see https://github.com/nodules/susanin
     */

    declare interface RouteConfigData {
        isFull?: boolean;
        isReplace?: boolean;
        hostname?: string;
        port?: string;
        protocol?: string;
        method?: string;
    }

    declare interface RouteConfig {
        pattern: string;
        defaults?: SimpleMap<string, string>;
        conditions?: SimpleMap<string, string|Array<string>>;
        page?: string;
        data?: RouteConfigData;
    }

    declare interface RouterConfig {
        isFull?: boolean;
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
        isExternal: boolean;
        isReplace: boolean;
    }

    declare interface Route {
        page: ?string;
        query: QueryMap;
        data: RouteData;
    }

    declare interface Router {
        find(options: LocationData): Route;
        build(name: string, params?: QueryMap): string;
    }

    declare interface RouterManager {
        changes: Observable<Route, Error>;
        resolve(): Route;
        build(name: string, params?: QueryMap): string;
        set(pageName: ?string, state?: QueryMap): void;
        update(pageName: ?string, state?: QueryMap): void;
    }

    declare type Renderer<Element, Widget> = (widget: Widget, error:? Error) => Element;
    declare type PageMap<Widget> = {[id: string]: Widget};

    declare interface AbstractLocation {
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
        ): void;
    }

    declare class RouterObserver<Element, Widget> extends SubscriptionObserver<Route, Error> {
        constructor(
            renderer: Renderer<Element, Widget>,
            pages: PageMap<Widget>,
            ErrorPage: Widget
        ): void;
    }
}
