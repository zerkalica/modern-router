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
        try {
            if (!page) {
                throw new PageNotFoundError(pageId)
            }
            h(getter(page), {})
        } catch (error) {
            try {
                h(getter(rec.ErrorPage), {error})
            } catch (subErr) {
                subErr.parent = error
                h(rec.FallbackPage, {error: subErr})
            }
            throw error
        }
    }
}
