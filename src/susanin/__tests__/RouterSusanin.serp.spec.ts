import { Router, routerConfig } from '../..'

import { searchRoute } from './routes'
import { metroMskMapper, metroSpbMapper } from './mappers'
import { memoFetch, toPromise } from './memoFetch'

describe('RouterSusanin.serp', () => {
    const routes = routerConfig({
        search: searchRoute,
    })

    function createFetch() {
        return memoFetch((url: string) => {
            if (url === '/region/MSK/metro')
                return Promise.resolve(metroMskMapper as any)
            if (url === '/region/SPB/metro')
                return Promise.resolve(metroSpbMapper as any)
            throw new Error('404')
        })
    }

    function createRouter(pathname: string, hostname = 'example.com') {
        return new Router({
            location: {
                hostname,
                pathname,
            },
            context: {
                fetch: createFetch(),
            },
            routes,
        })
    }

    async function getCurrent(pathname: string) {
        const router = createRouter(pathname)
        return toPromise(() => router.current)
    }

    describe('getting params with', () => {
        it('region', async () => {
            const current = await getCurrent(
                '/moskva/nedvizhimost/kupit-kvartiru'
            )
            expect(current.params).toEqual({
                metroIds: [],
                region: 'MSK',
                renovation: [],
                rooms: [],
            })
        })

        it('single room', async () => {
            const current = await getCurrent(
                '/moskva/nedvizhimost/kupit-kvartiru/1-komnata'
            )
            expect(current.params).toEqual({
                metroIds: [],
                region: 'MSK',
                renovation: [],
                rooms: ['ROOM_1'],
            })
        })

        it('multiple rooms only from query', async () => {
            const current = await getCurrent(
                '/moskva/nedvizhimost/kupit-kvartiru/3-komnaty?rooms=ROOM_1&rooms=ROOM_2'
            )
            expect(current.params).toEqual({
                metroIds: [],
                region: 'MSK',
                renovation: [],
                rooms: ['ROOM_1', 'ROOM_2'],
            })
        })

        it('room and metro and renovation', async () => {
            const current = await getCurrent(
                '/sankt-peterburg/nedvizhimost/kupit-kvartiru/3-komnaty/metro-devyatkino?renovation=EURO'
            )
            expect(current.params).toEqual({
                metroIds: [3333],
                region: 'SPB',
                renovation: ['EURO'],
                rooms: ['ROOM_3'],
            })
        })

        it('wrong room should throws', async () => {
            await getCurrent(
                '/moskva/nedvizhimost/kupit-kvartiru/11-komnata'
            ).catch(e => expect(e.message).toContain('Page not found'))
        })
    })

    describe('should build url with', () => {
        describe('single value of each type', () => {
            it('room', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata'
                )
            })
            it('room and metro', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [5223],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/metro-admiralteiskaya'
                )
            })
            it('metro', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [5223],
                        region: 'MSK',
                        renovation: [],
                        rooms: [],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/metro-admiralteiskaya'
                )
            })
            it('room and renovation', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [],
                        region: 'MSK',
                        renovation: ['EURO'],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/remont-euro'
                )
            })
            it('room, metro and renovation', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [5223],
                        region: 'MSK',
                        renovation: ['EURO'],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/metro-admiralteiskaya?renovation=EURO'
                )
            })

            it('room, metros and renovation', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [5223, 3333],
                        region: 'MSK',
                        renovation: ['EURO'],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata/remont-euro?metroIds=5223&metroIds=3333'
                )
            })
        })

        describe('multiple values', () => {
            it('rooms', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1', 'ROOM_2'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru?rooms=ROOM_1&rooms=ROOM_2'
                )
            })

            it('room and metros', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [5223, 1231],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata?metroIds=5223&metroIds=1231'
                )
            })
        })

        describe('wrong ids should throws error if', () => {
            it('metro from another region', async () => {
                const router = createRouter('/')

                await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [3333],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1'],
                    })
                ).catch(e =>
                    expect(e.message).toContain(
                        '3333 not a value of metroMskMapper'
                    )
                )
            })

            it('metros from another region (temporary not throws)', async () => {
                const router = createRouter('/')

                const url = await toPromise(() =>
                    router.routes.search.url({
                        metroIds: [3333, 23423],
                        region: 'MSK',
                        renovation: [],
                        rooms: ['ROOM_1'],
                    })
                )

                expect(url).toEqual(
                    '/moskva/nedvizhimost/kupit-kvartiru/1-komnata?metroIds=3333&metroIds=23423'
                )
            })
        })
    })
})
