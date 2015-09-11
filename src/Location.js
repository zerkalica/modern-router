import Router from './Router'
import LocationBar from 'location-bar'
import __debug from 'debug'

const debug = __debug('qiwi:platform:router:Location')

let prevLocation = null

export default class Location {
    constructor({pushState, router}: {
        pushState: bool,
        router: Router
    }) {
        if (prevLocation) {
            // only single instance per browser
            prevLocation.stop()
            prevLocation = null
        }
        this._locationBar = prevLocation = new LocationBar()

        this._changeRoute = ::this._changeRoute
        this._router =  router
        this._pushState = pushState
    }

    _select(page, query) {
        throw new Error('implement')
    }

    _changeRoute(path: string) {
        debug('path: %s', path)
        const params = {
            method: 'GET'
        }

        const result = this._router.resolve(path, params)

        const {data, query} = result || {
            data: {
                page: null
            },
            query: {}
        }

        this._select(data.page, query)
    }

    update(name: string, query: object = {}) {
        const url = this._router.build(name, query)
        this._locationBar.update(url, {
            trigger: true,
            replace: false
        })
    }

    stop() {
        this._locationBar.stop()
        prevLocation = null
    }

    start() {
        this._locationBar.onChange(this._changeRoute)
        this._locationBar.start({
            pushState: this._pushState
        })
    }
}
