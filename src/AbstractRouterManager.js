/* @flow */

import type {
    Route,
    QueryMap,
    RouterManager // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

// implements RouterManager
export default class AbstractRouterManager {
    changes: Observable<?Route, void>;
    resolve: () => ?Route;
    build: (name: string, params?: QueryMap) => string;
    pushState: (pageName: ?string, state?: QueryMap) => void;
    replaceState: (pageName: ?string, state?: QueryMap) => void;
}
