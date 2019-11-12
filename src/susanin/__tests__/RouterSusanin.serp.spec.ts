import { route, routerSusanin, s } from '../..'

import { searchRoute } from './routes'

const routerConfig = route.config({
    search: searchRoute,
})

describe('RouterSusanin.serp', () => {
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

    it('sh', () => {
        const router = createRouter('/')

        expect(router.current.name).toEqual('search')
    })
})
