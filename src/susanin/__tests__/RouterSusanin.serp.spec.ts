import { route, routerSusanin, s } from '../..'
import {
    MetroSeo,
    metroSeoToType,
    MetroType,
    metroTypeToSeo,
    RoomSeo,
    roomSeoToType,
    RoomSeoTag,
    RoomType,
    roomTypeToSeo,
    MetroSeoTag,
} from './dictionaries'

const SearchSeoType = s.rec({
    region: s.str,
    rooms: s.opt(s.arr(RoomType)),
    metroIds: s.opt(s.arr(MetroType)),
    part1: s.opt(s.var(s.undef, RoomSeo, MetroSeo)),
    part2: s.opt(s.var(s.tag('metro', MetroSeo))),
})

describe('RouterSusanin.serp', () => {
    const routerConfig = route.config({
        search: route(SearchSeoType, {
            pattern: p => `/${p.region}(/nedvizhimost(/kupit-kvartiru(/${p.part1})(/${p.part2})))`,
            postMatch: ({ rooms, metroIds, part1, part2 }) => {
                const v = {
                    rooms: rooms || (part1 instanceof RoomSeoTag ? [roomSeoToType(part1)] : []),
                    metroIds:
                        metroIds ||
                        (part1 instanceof MetroSeoTag
                            ? [metroSeoToType(part1)]
                            : part2 instanceof MetroSeoTag
                            ? [metroSeoToType(part2)]
                            : []),
                }
                return v
            },
            preBuild: ({ region, rooms, metroIds }) => {
                return SearchSeoType({
                    region,
                    rooms: rooms.length > 1 ? rooms : undefined,
                    metroIds: metroIds.length > 1 ? metroIds : undefined,
                    part1:
                        rooms.length === 1
                            ? roomTypeToSeo(rooms[0]).value
                            : metroIds.length === 1
                            ? metroTypeToSeo(metroIds[0]).value
                            : undefined,
                })
            },
        }),
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
})
