import {Class} from 'immutable-di/define'
import BaseRouter from 'reactive-router/Router'

@Class({
    routes: ['config', 'routes'],
    sitePrefix: ['config', 'sitePrefix'],
    origin: ['env', 'origin']
})
export default class Router extends BaseRouter {
    constructor(options) {
        super(options)
        this._origin = options.origin
    }

    buildExternal(name, params) {
        return this._origin + this.build(name, params)
    }
}
