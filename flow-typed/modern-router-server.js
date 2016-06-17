
import type {
    LocationData,
    QueryMap,
    // AbstractLocation,
    RouterConfig,
    RouterManager,
    GetKey
} from 'modern-router'

import type {ServerResponse} from 'modern-router/i/fixes'

interface Req {
    method: string;
    url: string;
    headers: Object;
}

declare module 'modern-router/server' {
    declare class ServerRouterManagerFactory {
        constructor(
            config: RouterConfig,
            getKey?: GetKey
        ): ServerRouterManagerFactory;

        create(location: AbstractLocation): RouterManager;
    }

    declare class AbstractLocation mixins $ObservableObject<AbstractLocation, Error> {
        redirect(url: string): void;
        replace(url: string): void;
        getParams(): LocationData;
        pushState(query: QueryMap, name: string, url: string): void;
        replaceState(query: QueryMap, name: string, url: string): void;
    }

    declare class RawHttpServerLocation mixins AbstractLocation {
        constructor(
            req: Req,
            res: ServerResponse,
            isHttps?: boolean,
            isTrustedProxy?: boolean
        ): RawHttpServerLocation;
    }
}
