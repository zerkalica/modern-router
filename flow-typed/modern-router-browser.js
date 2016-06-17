/* @flow */

import type {
    RouterConfig,
    RouterManager
} from 'modern-router'

import {
    AbstractLocation
} from 'modern-router'

declare module 'modern-router/browser' {
    declare interface BrowserLocationProps {
        location: Location;
        history: History;
    }

    declare class BrowserLocation mixins AbstractLocation {
        constructor(props: BrowserLocationProps): BrowserLocation;
    }
}
