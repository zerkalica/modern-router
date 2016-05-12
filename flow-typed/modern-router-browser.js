/* @flow */

import type {
    RouterConfig,
    RouterManager
} from 'modern-router'

declare module 'modern-router/browser' {
    declare function createBrowserRouterManager(
        window: Object,
        config: RouterConfig
    ): RouterManager;
}
