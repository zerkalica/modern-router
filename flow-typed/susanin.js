/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

interface SusaninRec {
    pattern: string;
    defaults?: ?SimpleMap<string, string>;
    conditions?: ?SimpleMap<string, string|Array<string>>;
    page?: string;
    data?: SimpleMap;
}

interface SusaninRoute<Data: Object, Params: Object> {
    getData(): Data;
    build(params: Params): string;
}

interface Susanin {
    addRoute(rec: SusaninRec): void;
    getRouteByName(name: string): ?SusaninRoute;
    findFirst<Query: Object>(path: string, params?: SimpleMap): ?[SusaninRoute, Query];
}

declare module susanin {
    declare var exports: Class<Susanin>;
}
