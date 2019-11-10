import { routerSusanin, route, s } from '../..'

describe('RouterSusanin', () => {
    const routeConfig = route.config({
        search: route(
            s.rec({
                region: s.opt(s.num),
            }),
            {
                pattern: p => `/${p.region}`,
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

        routes.search.url({

        })
    })
})
