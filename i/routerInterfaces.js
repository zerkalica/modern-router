RouterManager
/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

export type QueryMap = SimpleMap<string, string|Array<string>>;


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

export type RouteData = {
    isFull?: boolean;
    isReplace?: boolean;
    hostname?: string;
    port?: string;
    protocol?: string;
    method?: string;
}

export type Route = {
    page: ?string;
    query: QueryMap;
    data: RouteData;
};

export type RouteConfig = {
    pattern: string;
    defaults?: SimpleMap<string, string>;
    conditions?: SimpleMap<string, string|Array<string>>;
    page?: string;
    data?: RouteData;
};

export type RouteDataDefaults = {
    hostname: string;
    port: string;
    protocol: string;
    method: string;
}

export type SimpleLocation = RouteDataDefaults & {
    pathname: string;
    search: string;
}

export type RouterConfig = {
    isFull?: boolean;
    routes: SimpleMap<string, RouteConfig>;
}

export type AbstractLocation = {
    redirect(url: string): void;
    replace(url: string): void;
    getParams(): SimpleLocation;
    pushState(query: Object, name: string, url: string): void;
    replaceState(query: Object, name: string, url: string): void;
}

export type Router = {
    find(options: LocationParams): Route;
    build(name: string, params?: QueryMap): string;
}

export type RouterManager = {
    changes: Observable<Route, Error>;
    resolve(): Route;
    build(name: string, params?: QueryMap = {}): string;
    set(pageName: ?string, state?: QueryMap): void;
    update(pageName: ?string, state?: QueryMap): void;
}

export type Renderer<Element, Widget> = (widget: Widget, error:? Error) => Element;
export type PageMap<Widget> = {[id: string]: Widget};
