import { Router, routerConfig, PageNotFoundError, route, s } from '../..'

const SearchSeo = s.Rec({
    region: s.Opt(s.Str),
    stationId: s.Str,
})
const SearchType = s.Rec({
    region: s.Opt(s.Str),
    stationId: s.Num,
})

function searchSeoToType(raw: ReturnType<typeof SearchSeo>) {
    return SearchType({
        region: raw.region,
        stationId: Number(raw.stationId),
    })
}

function searchTypeToSeo(params: ReturnType<typeof SearchType>) {
    return SearchSeo({
        region: params.region,
        stationId: String(params.stationId),
    })
}
searchTypeToSeo.metadata = SearchSeo.metadata

const searchRoute = route({
    pattern: p => `/region(/${p.region})/${p.stationId}`,
    fromQuery: searchSeoToType,
    toQuery: searchTypeToSeo,
})

describe('RouterSusanin.base', () => {
    const routes = routerConfig({
        search: searchRoute,
    })

    function createRouter(pathname: string, hostname = 'example.com') {
        return new Router({
            location: {
                hostname,
                pathname,
            },
            context: {},
            routes,
        })
    }

    it('throws PageNotFoundError on wrong path', () => {
        const router = createRouter('/')
        expect(() => router.current).toThrow(PageNotFoundError)
    })

    describe('regular route', () => {
        let router: ReturnType<typeof createRouter>
        beforeEach(() => {
            router = createRouter('/region/1/2')
        })

        it('match by url', () => {
            expect(router.current.name).toEqual('search')
        })

        it('resolve parameters', () => {
            const current = router.current

            expect(current.params).toEqual({
                region: '1',
                stationId: 2,
            })
        })

        it('build url', () => {
            expect(
                router.routes.search.url({ stationId: 1, region: 'moscow' })
            ).toEqual('/region/moscow/1')
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
