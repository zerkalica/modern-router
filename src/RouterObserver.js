/* @flow */
import type {
    Route,
    PageMap,
    Renderer
} from 'modern-router/i/routerInterfaces'

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'

export default class RouterObserver<Element, Widget> {
    _renderer: Renderer<Element, Widget>;
    _pages: PageMap<Widget>;
    _ErrorPage: Widget;

    constructor(
        renderer: Renderer<Element, Widget>,
        pages: PageMap<Widget>,
        ErrorPage: Widget
    ) {
        this._renderer = renderer
        this._pages = pages
        this._ErrorPage = ErrorPage
    }

    next(route: Route): void {
        const pages = this._pages
        if (!pages[route.page]) {
            throw new PageNotFoundError(route.page)
        }
        this._renderer(pages[route.page])
    }

    error(err: Error): void {
        this._renderer(this._ErrorPage, err)
    }

    complete(): void {}
}
