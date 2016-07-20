/* @flow */

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import Route from 'modern-router/Route'
import RouterConfig from 'modern-router/RouterConfig'
import RouterManagerFactory from 'modern-router/RouterManagerFactory'
import SusaninRouter from 'modern-router/SusaninRouter'
import RouterManager from 'modern-router/RouterManager'

export type {
    PageRec,
    LocationData,
    IRoute,
    Router,
    IRouterManager,
    AbstractLocation,
    RouteConfigData,
    RouteConfig,
    RouteConfigProps
} from 'modern-router/interfaces'

export {
    SusaninRouter,
    Route,
    RouterManager,
    RouterConfig,
    PageNotFoundError,
    RouterManagerFactory
}
