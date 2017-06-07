/* @flow */

type SimpleMap<V, K> = {[id: V]: K};

interface SusaninRec {
    pattern: string;
    defaults?: ?SimpleMap<string, string>;
    conditions?: ?SimpleMap<string, string|Array<string>>;
    page?: string;
    data?: SimpleMap<string, any>;
}

interface SusaninRoute<Data: Object, Params: Object> {
    _options: {
        defaults: Object;
    };
    getData(): Data;
    getName(): string;
    build(params: Params): string;
}

interface Susanin {
    constructor(): Susanin;
    addRoute(rec: SusaninRec): void;
    getRouteByName(name: string): ?SusaninRoute<*, *>;
    findFirst<Query: Object>(path: string, params?: SimpleMap<string, *>): ?[SusaninRoute<*, *>, Query];
}

declare module susanin {
    declare var exports: Class<Susanin>;
}
