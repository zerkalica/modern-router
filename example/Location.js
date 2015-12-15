import {Class, Setter, Getter} from 'immutable-di/define'
import BaseLocation from 'reactive-router/Location'
import Router from './Router'

@Class({
    getQuery: Getter(['route', 'query']),
    getPage: Getter(['route', 'page']),
    pushState: ['config', 'router', 'pushState'],
    router: Router,
    setRoute: Setter(['route']),
    sitePrefix: ['config', 'sitePrefix'],
    setServerErrors: Setter(['fetcher', 'error'])
})
export default class Location extends BaseLocation {
    constructor({
        getQuery,
        getPage,
        pushState,
        router,
        setRoute,
        sitePrefix,
        setServerErrors
    }) {
        super({
            pushState,
            router,
            sitePrefix
        })
        this._getQuery = getQuery
        this._getPage = getPage
        this._setRoute = setRoute
        this._setServerErrors = setServerErrors
    }

    merge(page: string, query) {
        this.update(page || this._getPage(), {
            ...this._getQuery(),
            ...query || {}
        })
    }

    select(page, query) {
        this._select(page, {
            ...this._getQuery(),
            ...query || {}
        })
    }

    _select(page, query, path) {
        this._setServerErrors('')
        this._setRoute({page, query, path}).commit()
    }
}
