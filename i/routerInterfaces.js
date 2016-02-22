/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

export type QueryMap = SimpleMap<string, string|Array<string>>;

export type Route = {
    page: string;
    query: QueryMap;
};

export type Router = {
    getRoute(name: string, params: ?QueryMap): {
        isExternal: boolean,
        url: string
    };
    build(name: string, params: ?QueryMap): string;
    resolve(path: string, params: ?QueryMap): ?Route;
}

export type Redirector = {
    redirect(url: string): void;
    replace(url: string): void;
}

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
export type RouteConfig = {
    pattern: string;
    defaults?: SimpleMap<string, string>;
    conditions?: SimpleMap<string, string|Array<string>>;
    page?: string;
    data?: {
        hostname?: string;
        port?: string;
        protocol?: string;
        method?: string;
    };
};

export type SimpleLocation = {
    hostname: string;
    port: string;
    protocol: string;
    method: string;
}

export type RouterConfig = SimpleMap<string, RouteConfig>;

export type RouterLocation = {
    pushState(pageName: ?string, state?: QueryMap): void;
    replaceState(pageName: ?string, state?: QueryMap): void;
    dispose(): void;
    isDisposed: boolean;
}
