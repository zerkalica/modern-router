/* @flow */

import type {
    RouterConfig,
    RouterManager,
    PageRec
} from 'modern-router'

import {
    AbstractLocation
} from 'modern-router'

declare module 'modern-router/browser' {
    declare interface BrowserLocationProps {
        location: Location;
        history: History;
    }

    declare function createBrowserRenderer<Widget, Component>(
        rec: PageRec<Widget, Component>,
        getter: (w: Widget) => Component,
        h: (component: Component, props: {[id: string]: mixed}) => void
    ): (page: ?string) => void

    declare class BrowserLocation mixins AbstractLocation {
        constructor(props: BrowserLocationProps): BrowserLocation;
    }
}
