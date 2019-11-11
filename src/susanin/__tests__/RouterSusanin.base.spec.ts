import { routerSusanin, route, s } from '../..'
import { PageNotFoundError } from '../../Router'

describe('RouterSusanin.base', () => {
    const routerConfig = route.config({
        search: route(
            s.rec({
                region: s.opt(s.str),
                stationId: s.str,
            }),
            {
                pattern: p => `/region(/${p.region})/${p.stationId}`,
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

    function createRouter(pathname: string, hostname = 'example.com') {
        return routerSusanin({
            location: {
                hostname,
                pathname,
            },
            context: {},
            routerConfig,
        })
    }

    it('throws PageNotFoundError on wrong path', () => {
        const routes = createRouter('/')
        expect(() => routes.current).toThrow(PageNotFoundError)
    })

    describe('regular route', () => {
        let routes: ReturnType<typeof createRouter>
        beforeEach(() => {
            routes = createRouter('/region/1/2')
        })

        it('match by url', () => {
            expect(routes.current.name).toEqual('search')
        })
    
        it('resolve parameters', () => {
            const current = routes.current
            expect(current.params).toEqual({
                region: '1',
                stationId: 2,
            })
        })

        it('build url', () => {
            expect(routes.search.url({ stationId: 1, region: 'moscow' })).toEqual('/region/moscow/1')
        })
    })

    it('resolve optional parameters', () => {
        const routes = createRouter('/region/123')
        const current = routes.current
        expect(current.params).toEqual({
            region: undefined,
            stationId: 123,
        })
    })
})
