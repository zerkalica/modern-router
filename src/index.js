/* @flow */

import PageNotFoundError from 'modern-router/errors/PageNotFoundError'
import Route from 'modern-router/Route'
import RouterConfig from 'modern-router/RouterConfig'
import createRouterFactory from 'modern-router/createRouterFactory'
import SusaninRouter from 'modern-router/SusaninRouter'
import RouterManager from 'modern-router/RouterManager'
import AbstractLocation from 'modern-router/AbstractLocation'

export type {
    PageRec,
    LocationData,
    IRoute,
    Router,
    IRouterManager,
    RouteConfig,
    IRouterConfig
} from 'modern-router/interfaces'

export {
    SusaninRouter,
    Route,
    AbstractLocation,
    RouterManager,
    RouterConfig,
    PageNotFoundError,
    createRouterFactory
}
