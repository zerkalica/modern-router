import { routerSusanin, route, s } from '../..'

describe('RouterSusanin', () => {
    const routerConfig = route.config({
        search: route(
            s.rec({
                region: s.opt(s.str),
                stationId: s.num,
            }),
            {
                pattern: p => `/${p.region}/${p.stationId}`,
                postMatch(raw) {
                    return {
                        stationId: Number(raw.stationId),
                        region: raw.region,
                    }
                },
                preBuild(params) {
                    return {
                        stationId: String(params.stationId),
                        region: params.region,
                    }
                },
            }
        ),
    })

    it('simple', () => {
        const routes = routerSusanin({
            location: {
                search: '',
                origin: '',
                port: '80',
                hostname: 'example.com',
                pathname: '/1/2',
            },
            context: {},
            routerConfig,
        })

        const current = routes.current
        expect(current.name).toEqual('search')
        expect(routes.search.url({ stationId: 1, region: 'moscow' })).toEqual('/moscow/1')
    })
})
