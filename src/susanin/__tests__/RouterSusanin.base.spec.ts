import { routerSusanin, route, s } from '../..'
import { PageNotFoundError } from '../../Router'

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
        stationId: Number(raw.region)
    })
}
searchSeoToType.metadata = SearchType.metadata

function searchTypeToSeo(params: ReturnType<typeof SearchType>) {
    return SearchSeo({
        region: params.region,
        stationId: String(params.region)
    })
}


describe('RouterSusanin.base', () => {
    const routerConfig = route.config({
        search: route(
            {
                pattern: p => `/region(/${p.region})/${p.stationId}`,
                fromQuery: searchSeoToType,
                toQuery: searchTypeToSeo,
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
