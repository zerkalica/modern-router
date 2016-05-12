/* @flow */

import type {
    ServerResponse,
    AbstractLocation,
    RouterConfig,
    RouterManager
} from 'modern-router'

interface Req {
    method: string;
    url: string;
    headers: Object;
}

declare module 'modern-router/server' {
    declare function createServerRouterManager(
        location: AbstractLocation,
        config: RouterConfig
    ): RouterManager;

    declare class RawHttpServerLocation {
        constructor(
            req: Req,
            res: ServerResponse,
            isHttps?: boolean,
            isTrustedProxy?: boolean
        ): void;
    }
}
