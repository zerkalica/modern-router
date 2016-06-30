/* @flow */

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import Route from 'modern-router/Route'
import RouterConfig from 'modern-router/RouterConfig'
import RouterManagerFactory from 'modern-router/RouterManagerFactory'
import SusaninRouter from 'modern-router/SusaninRouter'

export type {
    PageRec,
    LocationData,
    IRoute,
    Router,
    RouterManager,
    AbstractLocation,
    RouteConfigData,
    RouteConfig,
    RouteConfigProps
} from 'modern-router/interfaces'

export {
    SusaninRouter,
    Route,
    RouterConfig,
    PageNotFoundError,
    RouterManagerFactory
}
