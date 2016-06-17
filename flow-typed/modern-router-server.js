
import type {
    LocationData,
    QueryMap,
    RouterConfig,
    RouterManager,
    GetKey
} from 'modern-router'

import type {ServerResponse} from 'modern-router/i/fixes'

import {
    AbstractLocation
} from 'modern-router'

interface Req {
    method: string;
    url: string;
    headers: Object;
}

declare module 'modern-router/server' {
    declare class RawHttpServerLocation mixins AbstractLocation {
        constructor(
            req: Req,
            res: ServerResponse,
            isHttps?: boolean,
            isTrustedProxy?: boolean
        ): RawHttpServerLocation;
    }
}
