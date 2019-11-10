import { routerSusanin, route, s } from '../..'

describe('RouterSusanin', () => {
    const routeConfig = route.config({
        search: route(
            s.rec({
                region: s.opt(s.num),
                id: s.num,
            }),
            {
                pattern: p => `/${p.region}/${p.id}`,
            }
        ),
        offer: route(
            s.rec({
                region: s.opt(s.num),
                id: s.num,
            }),
            {
                pattern: p => `/offer/${p.id}`,
            }
        )
    })

    it('simple', () => {
        const routes = routerSusanin({
            location: {
                search: '',
                origin: '',
                port: '80',
                hostname: 'example.com',
                pathname: '/',
            },
            context: {},
            routerConfig: routeConfig,
        })
        routes.current.name

        routes.search.url({
            region: 1,
            id: 1
        })
    })
})
