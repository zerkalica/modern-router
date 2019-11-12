import { route, s } from '../../..'
import {
    MetroSeo,
    metroSeoToType,
    MetroType,
    metroTypeToSeo,
    renovationSeoToType,
    RenovationType,
    RoomSeo,
    roomSeoToType,
    RoomType,
    roomTypeToSeo,
    renovationTypeToSeo,
    RenovationSeo,
} from '../dictionaries'


const SearchType = s.Rec({
    region: s.Str,
    rooms: s.List(RoomType),
    renovation: s.List(RenovationType),
    metroIds: s.List(MetroType),
})

const SearchSeoType = s.Rec({
    region: s.Str,
    rooms: s.Opt(s.List(RoomType)),
    renovation: s.Opt(s.List(RenovationType)),
    metroIds: s.Opt(s.List(MetroType)),
    part1: s.Opt(s.Var(s.Undef, RoomSeo, MetroSeo, RenovationSeo)),
    part2: s.Opt(s.Var(s.Undef, MetroSeo, RenovationSeo)),
})

function searchSeoToType(seoParams: ReturnType<typeof SearchSeoType>) {
    const raw = SearchSeoType(seoParams)
    const roomPart = roomSeoToType(raw.part1)
    const metroPart = roomPart ? metroSeoToType(raw.part2) : metroSeoToType(raw.part1)
    const renovationPart = roomPart ? renovationSeoToType(raw.part2) : renovationSeoToType(raw.part1)

    return SearchType({
        region: raw.region,
        renovation: raw.renovation || (renovationPart ? [renovationPart] : []),
        rooms: raw.rooms || (roomPart ? [roomPart] : []),
        metroIds: raw.metroIds || (metroPart ? [metroPart] : []),
    })
}
searchSeoToType.metadata = SearchType.metadata

function searchTypeToSeo(params: ReturnType<typeof SearchType>) {
    const { renovation, region, rooms, metroIds } = SearchType(params)
    const roomPart = rooms.length === 1 ? roomTypeToSeo(rooms[0]) : undefined
    const metroPart = metroIds.length === 1 ? metroTypeToSeo(metroIds[0]) : undefined
    const renovationPart = renovation.length === 1 ? renovationTypeToSeo(renovation[0]) : undefined

    return SearchSeoType({
        region,
        rooms: roomPart ? undefined : rooms,
        metroIds: metroPart ? undefined : metroIds,
        part1: roomPart ? roomPart : metroPart || renovationPart,
        part2: roomPart ? undefined : metroPart || renovationPart,
    })
}


export const searchRoute = route({
    pattern: p => `/${p.region}(/nedvizhimost(/kupit-kvartiru(/${p.part1})(/${p.part2})))`,
    fromQuery: searchSeoToType,
    toQuery: searchTypeToSeo,
})

