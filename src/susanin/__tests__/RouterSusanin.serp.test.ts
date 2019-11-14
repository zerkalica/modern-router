import { Router, toPromise } from '../..';
import { mskMetroMapper, spbMetroMapper } from './mappers';
import { memoFetch } from './memoFetch';
import { SearchRoute } from './routes';

describe('RouterSusanin.serp', () => {
    function createFetch() {
        return memoFetch((url: string) => {
            if (url === '/region/MSK/metro') {
                return Promise.resolve(mskMetroMapper as any);
            }
            if (url === '/region/SPB/metro') {
                return Promise.resolve(spbMetroMapper as any);
            }
            throw new Error('404');
        });
    }

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
            context: {
                fetch: createFetch()
            }
        });
    }

    function getParams(pathname: string) {
        const router = createRouter(pathname);

        return toPromise(() => router.params(SearchRoute));
    }

    describe('getting params with', () => {
        it('region', async() => {
            const params = await getParams(
                '/moskva/nedvizhimost/kupit-kvartiru'
            );

            expect(params).toEqual({
                metroIds: [],
                districtIds: [],
                region: 'MSK',
                renovation: [],
                rooms: []
            });
        });

        it('single room', async() => {
            const current = await getParams(
                '/moskva/nedvizhimost/kupit-kvartiru/1-komnata'
            );

            expect(current).toEqual({
                metroIds: [],
                districtIds: [],
                region: 'MSK',
                renovation: [],
                rooms: [ 'ROOM_1' ]
            });
        });

        it('multiple rooms only from query', async() => {
            const current = await getParams(
                '/moskva/nedvizhimost/kupit-kvartiru/3-komnaty?rooms=ROOM_1&rooms=ROOM_2'
            );

            expect(current).toEqual({
                metroIds: [],
                districtIds: [],
                region: 'MSK',
                renovation: [],
                rooms: [ 'ROOM_1', 'ROOM_2' ]
            });
        });

        it('room and metro and renovation', async() => {
            const current = await getParams(
                '/sankt-peterburg/nedvizhimost/kupit-kvartiru/3-komnaty/metro-devyatkino?renovation=EURO'
            );

            expect(current).toEqual({
                metroIds: [ 894 ],
                districtIds: [],
                region: 'SPB',
                renovation: [ 'EURO' ],
                rooms: [ 'ROOM_3' ]
            });
        });

        it('wrong room should throws', async() => {
            await getParams(
                '/moskva/nedvizhimost/kupit-kvartiru/11-komnata'
            ).catch((e: Error) => expect(e.message).toContain('not matched'));
        });
    });

    describe('should build url with', () => {
        describe('single value of each type', () => {
            it('room', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata'
                );
            });
            it('room and metro', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 14567 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/metro-arbatskaya'
                );
            });
            it('metro', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 14567 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: []
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/metro-arbatskaya'
                );
            });
            it('room and renovation', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [ 'EURO' ],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/remont-euro'
                );
            });
            it('room, metro and renovation', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 14567 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [ 'EURO' ],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/metro-arbatskaya/remont-euro'
                );
            });

            it('room, metros and renovation', async() => {
                const router = createRouter('/');
                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 14567, 3333 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [ 'EURO' ],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/remont-euro?metroIds=14567&metroIds=3333'
                );
            });
        });

        describe('multiple values', () => {
            it('rooms', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1', 'ROOM_2' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru?rooms=ROOM_1&rooms=ROOM_2'
                );
            });

            it('room and metros', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 14567, 1231 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata?metroIds=14567&metroIds=1231'
                );
            });
        });

        describe('wrong ids should throws error if', () => {
            it('metro from another region', async() => {
                const router = createRouter('/');

                await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 3333 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1' ]
                    })
                ).catch((e: Error) =>
                    expect(e.message).toContain(
                        '3333 not a value of mskMetroMapper'
                    )
                );
            });

            it('metros from another region (temporary not throws)', async() => {
                const router = createRouter('/');

                const url = await toPromise(() =>
                    router.route(SearchRoute).url({
                        metroIds: [ 3333, 23423 ],
                        districtIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: [ 'ROOM_1' ]
                    })
                );

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata?metroIds=3333&metroIds=23423'
                );
            });
        });
    });
});
