import { Router, s, Tokens } from '../..';
import { SusaninRoute } from '../SusaninRoute';

const SearchSeoType = s.rec({
    region: s.opt(s.str),
    stationId: s.str
});

type ISearchSeoType = ReturnType<typeof SearchSeoType>

const SearchType = s.rec({
    region: s.opt(s.str),
    stationId: s.num
});

type ISearchType = ReturnType<typeof SearchType>

class SearchRoute extends SusaninRoute<ISearchSeoType, ISearchType, {id: string}> {
    metadata = SearchSeoType.config;

    fromQuery(raw: ISearchSeoType) {
        return SearchType({
            region: raw.region,
            stationId: Number(raw.stationId)
        });
    }
    
    toQuery(params: ISearchType) {
        return SearchSeoType({
            region: params.region,
            stationId: String(params.stationId)
        });
    }
    
    pattern(p: Tokens<ISearchSeoType>) {
        return `/region(/${p.region})/${p.stationId}`
    }
}

type IOfferSeoType = {
    id: string;
}

type IOfferType = {
    id: number;
}

class OfferRoute extends SusaninRoute<IOfferSeoType, IOfferType> {
    metadata = { id: 'id' }
    fromQuery({ id }: IOfferSeoType): IOfferType {
        return {
            id: Number(id)
        };
    }    

    toQuery({ id }: IOfferType): IOfferSeoType {
        return {
            id: String(id)
        };
    }    
    pattern(p: Tokens<IOfferSeoType>) {
        return `/offer/${p.id}`
    }
}

describe('RouterSusanin.base', () => {
    function createRouter(pathname: string, hostname = 'example.com') {
        return new Router({
            location: {
                port: '80',
                origin: hostname,
                search: '',
                hostname,
                pathname,
                hash: '',
                protocol: 'https'
            },
            context: {id: '1'}
        });
    }

    it('throws PageNotFoundError on wrong path', () => {
        const router = createRouter('/');

        expect(() => router.params(SearchRoute)).toThrow(Error);
    });

    describe('regular route', () => {
        let router: ReturnType<typeof createRouter>;

        beforeEach(() => {
            router = createRouter('/region/1/2');
        });

        it('match by url', () => {
            expect(router.resolve([SearchRoute]).RouteClass).toEqual(SearchRoute);
        });

        it('resolve parameters', () => {
            const params = router.params(SearchRoute);

            expect(params).toEqual({
                region: '1',
                stationId: 2
            });
        });

        it('build url', () => {
            expect(
                router.route(SearchRoute).url({ stationId: 1, region: 'moscow' })
            ).toEqual('/region/moscow/1');
        });
    });

    it('resolve optional parameters', () => {
        const routesOptional = createRouter('/region/123');
        const params = routesOptional.params(SearchRoute);

        expect(params).toEqual({
            region: undefined,
            stationId: 123
        });
    });
});
