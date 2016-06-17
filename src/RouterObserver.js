/* @flow */
import type {
    Route,
    PageMap,
    Renderer
} from 'modern-router'

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

    _render(page: Widget): void {
        try {
            this._renderer(page)
        } catch (err) {
            this.error(err)
        }
    }

    next(route: ?Route): void {
        const pages = this._pages
        const page: ?string = route ? route.page : null
        if (!page || !pages[page]) {
            const err = new PageNotFoundError(page)
            this.error(err)
            return
        }
        this._render(pages[page])
    }

    error(err: Error): void {
        this._renderer(this._ErrorPage, err)
    }

    complete(): void {}
}
