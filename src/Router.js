import Susanin from 'susanin'

/**
    "routes": {
        "RouteName": {
            "pattern": "PathPattern",
            "data": {
                "page": "PageControllerId"
            }
        },
        "PathPattern": "PageControolerId=RouteName"
    }
 */
export default class Router {
    constructor({routes, sitePrefix}) {
        this._susanin = new Susanin()
        Object.keys(routes).forEach(name => {
            let route
            if (typeof routes[name] === 'string') {
                route = {
                    name: routes[name],
                    pattern: sitePrefix + name,
                    data: {
                        method: 'GET',
                        page: routes[name]
                    }
                }
            } else {
                const r = routes[name] || {}
                route = {
                    name,
                    pattern: (r.sitePrefix || sitePrefix) + r.pattern,
                    data: r.data || {}
                }
                route.data.method = route.data.method || 'GET'
            }

            this._susanin.addRoute(route)
        })
    }

    build(name: string, params: ?object = {}): string {
        const route = this._susanin.getRouteByName(name)
        if (!route) {
            throw new Error('Route not found: ' + name)
        }

        return route.build(params)
    }

    resolve(path: string, params: ?object = {}): ?{data: object, query: object} {
        let result
        const rec = this._susanin.findFirst('/' + path, params)
        if (rec) {
            const [route, query] = rec
            result = {
                data: route.getData(),
                query
            }
        }

        return result
    }
}
