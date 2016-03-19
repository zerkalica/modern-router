/* @flow */

import type {
    QueryMap,
    Route,
    RouterLocation,
    Router,
    RouterManager // eslint-disable-line
} from 'modern-router/i/routerInterfaces'

// implements RouterManager
export default class DefaultRouterManager {
    changes: Observable<?Route, void>;
    _router: Router;
    _location: RouterLocation;

    constructor(
        changes: Observable<?Route, void>,
        router: Router,
        location: RouterLocation
    ) {
        this.changes = changes
        this._router = router
        this._location = location
    }

    resolve(): Route {
        return this._router.resolve()
    }

    build(name: string, params?: QueryMap = {}): string {
        return this._router.build(name, params)
    }

    set(pageName: ?string, state?: QueryMap): void {
        this._location.set(pageName, state)
    }

    update(pageName: ?string, state?: QueryMap): void {
        this._location.update(pageName, state)
    }
}
