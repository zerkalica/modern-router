/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

type SusaninRec = {
    pattern: string;
    defaults?: SimpleMap<string, string>;
    conditions?: SimpleMap<string, string|Array<string>>;
    page?: string;
    data?: SimpleMap;
}

interface SusaninRoute<Data: Object, Params: Object> { // eslint-disable-line
    getData(): Data;
    build(params: Params): string;
}

interface Susanin {
    addRoute(rec: SusaninRec): void;
    getRouteByName(name: string): ?SusaninRoute;
    findFirst<Query: Object>(path: string, params?: SimpleMap): ?[SusaninRoute, Query]; // eslint-disable-line
}

declare module susanin {
    declare var exports: Class<Susanin>;
}
