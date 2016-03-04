RouterManager
/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

export type QueryMap = SimpleMap<string, string|Array<string>>;

export type Route = {
    page: string;
    query: QueryMap;
};

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
     hostname?: string;
     port?: string;
     protocol?: string;
     method?: string;
 }

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

export interface Redirector {
    redirect(url: string): void;
    replace(url: string): void;
}

export interface Router {
    isExternal(name: string): boolean;
    build(name: string, params?: QueryMap): string;
    resolve(): ?Route;
}

export interface RouterLocation {
    pushState(pageName: ?string, state?: QueryMap, replaceQuery?: boolean): void;
    replaceState(pageName: ?string, state?: QueryMap, replaceQuery?: boolean): void;
}

export interface RouterManager {
    changes: Observable<?Route, void>;
    resolve(): ?Route;
    build(name: string, params?: QueryMap = {}): string;
    pushState(pageName: ?string, state?: QueryMap, replaceQuery?: boolean): void;
    replaceState(pageName: ?string, state?: QueryMap, replaceQuery?: boolean): void;
}
