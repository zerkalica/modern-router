/* @flow */

import type {
    PageRec
} from 'modern-router/interfaces'

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'

export default function createBrowserRenderer<Widget, Component>(
    rec: PageRec<Widget, Component>,
    getter: (w: Widget) => Component,
    h: (component: Component, props: {[id: string]: mixed}) => void
): (page: ?string) => void {
    return function browserRenderer(pageId: ?string): void {
        const page: ?Widget = pageId ? rec.pages[pageId] : null
        let error: ?Error = page ? null : new PageNotFoundError(pageId)
        let component: ?Component = null
        try {
            component = getter(page || rec.ErrorPage)
        } catch (err) {
            error = err
        }
        h(component || rec.FallbackPage, {error})
    }
}
