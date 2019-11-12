import { SeoMapper, toArray, route, s } from '../../..'
import { roomMapper, renovationMapper, regionMapper } from '../mappers'

interface Context {
    fetch<Data>(url: string): Data
}

function metroMapperByRegion(
    region: ReturnType<typeof regionMapper.Type>,
    context: Context
) {
    return region === 'MSK' ||
        region === 'MSK_OBL' ||
        region === 'MSK_AND_MSK_OBL'
        ? context.fetch<SeoMapper>('/region/MSK/metro')
        : context.fetch<SeoMapper>('/region/SPB/metro')
}

const SearchType = s.Rec({
    region: regionMapper.Type,
    rooms: s.List(roomMapper.Type),
    renovation: s.List(renovationMapper.Type),
    metroIds: s.List(s.Num),
})

const SearchSeo = s.Rec({
    region: regionMapper.Seo,
    rooms: s.Opt(s.List(roomMapper.Type)),
    renovation: s.Opt(s.Var(renovationMapper.Type, s.List(renovationMapper.Type))),
    metroIds: s.Opt(s.List(s.Num)),
    part1: s.Opt(s.Var(s.Undef, roomMapper.Seo, renovationMapper.Seo, s.Str)),
    part2: s.Opt(s.Var(s.Undef, renovationMapper.Seo, s.Str)),
})

function searchSeoToType(
    seoParams: ReturnType<typeof SearchSeo>,
    context: Context
) {
    const region = regionMapper.typeFromSeo(seoParams.region)
    const raw = SearchSeo(seoParams)

    const roomPart = roomMapper.typeFromAny(raw.part1)

    const metroMapper = metroMapperByRegion(region, context)

    const metroPart = roomPart
        ? metroMapper.typeFromAny(raw.part2)
        : metroMapper.typeFromAny(raw.part1)

    const renovationPart = roomPart
        ? renovationMapper.typeFromAny(raw.part2)
        : renovationMapper.typeFromAny(raw.part1)

    return SearchType({
        region,
        renovation: toArray(raw.renovation) || toArray(renovationPart) || [],
        rooms: raw.rooms || toArray(roomPart) || [],
        metroIds: toArray(raw.metroIds) || (metroPart ? [Number(metroPart)] : []),
    })
}

function searchTypeToSeo(
    params: ReturnType<typeof SearchType>,
    context: Context
) {
    const { renovation, region, rooms, metroIds } = SearchType(params)
    const roomPart =
        rooms.length === 1 ? roomMapper.seoFromType(rooms[0]) : undefined
    const metroPart =
        metroIds.length === 1
            ? metroMapperByRegion(region, context).seoFromType(
                  String(metroIds[0])
              )
            : undefined

    const renovationPart =
        renovation.length === 1
            ? renovationMapper.seoFromType(renovation[0])
            : undefined

    const part1 = roomPart ? roomPart : metroPart || renovationPart
    const part2 = roomPart ? metroPart || renovationPart : undefined

    const hasPart = (subject: string | undefined) =>
        (part1 !== undefined && part1 === subject) ||
        (part2 !== undefined && part2 === subject)

    const v = {
        region: regionMapper.seoFromType(region),
        rooms: hasPart(roomPart) ? undefined : rooms,
        metroIds: hasPart(metroPart) ? undefined : metroIds,
        renovation: hasPart(renovationPart) ? undefined : renovation,
        part1,
        part2,
    }

    return v
}

searchTypeToSeo.metadata = SearchSeo.metadata

export const searchRoute = route({
    pattern: p =>
        `/${p.region}/nedvizhimost/kupit-kvartiru(/${p.part1})(/${p.part2})`,
    fromQuery: searchSeoToType,
    toQuery: searchTypeToSeo,
})
