RouterManager
/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

export type QueryMap = SimpleMap<string, string|Array<string>>;

export type Route = {
    page: ?string;
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
     isReplace?: boolean;
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

export type Redirector = {
    redirect(url: string): void;
    replace(url: string): void;
}

export type Router = {
    getData(name: string): RouteData;
    build(name: string, params?: QueryMap): string;
    resolve(): Route;
}

export type RouterLocation = {
    set(pageName: ?string, state?: QueryMap): void;
    update(pageName: ?string, state?: QueryMap): void;
}

export type RouterManager = RouterLocation & {
    changes: Observable<?Route, void>;
    resolve(): Route;
    build(name: string, params?: QueryMap = {}): string;
    set(pageName: ?string, state?: QueryMap): void;
    update(pageName: ?string, state?: QueryMap): void;
}

export type Renderer<Element, Widget> = (widget: Widget, error:? Error) => Element;
export type PageMap<Widget> = {[id: string]: Widget};
