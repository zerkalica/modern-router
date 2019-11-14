import { Tokens, SusaninRoute, s } from '../../..';
import {
    getDistrictMapperByRegion,
    getMetroMapperByRegion,
    regionMapper,
    renovationMapper,
    roomMapper,
} from '../mappers';
import { Route, RouteConstructor } from '../../../Route';

const SearchType = s.rec({
    region: regionMapper.Type,
    rooms: s.list(roomMapper.Type),
    renovation: s.list(renovationMapper.Type),
    metroIds: s.list(s.num),
    districtIds: s.list(s.num),
});
type ISearchType = ReturnType<typeof SearchType>;

const SearchSeoType = s.rec({
    region: regionMapper.SeoType,
    room: s.opt(roomMapper.SeoType),
    remont: s.opt(renovationMapper.SeoType),
    metro: s.opt(s.str),
    rayon: s.opt(s.str),
    okrug: s.opt(s.str),

    rooms: s.maybeArray(roomMapper.Type),
    renovation: s.maybeArray(renovationMapper.Type),
    metroIds: s.maybeArray(s.str),
    districtIds: s.maybeArray(s.str),
});
type ISearchSeoType = ReturnType<typeof SearchSeoType>;

const searchRouteDefaults = {
    region: 'MSK',
    metroIds: [],
    districtIds: [],
    rooms: [],
    renovation: []
} as const

function route<Input, Output, Context, Defaults>(
    {InputType, OutputType, defaults, pattern}: {
        InputType: ((v: Input) => Input) & {config: object},
        OutputType: (v: Output) => Output,
        defaults: Defaults
        pattern: (p: Tokens<Input>) => string
    }
): RouteConstructor<Output, Context, Defaults> {
    return class extends SusaninRoute<Input, Output, Context, Defaults> {
        metadata = InputType.config
        defaults() { return defaults }
        pattern(p: Tokens<Input> ) { return pattern(p) }
    }
}

export class SearchRoute extends SusaninRoute<ISearchSeoType, ISearchType, any, typeof searchRouteDefaults> {
    defaults() {
        return searchRouteDefaults
    }

    fromQuery(seo: ISearchSeoType) {
        const raw = SearchSeoType(seo);
        const region =
            raw.region === undefined
                ? 'MSK'
                : regionMapper.typeFromSeo(raw.region);

        const metroMapper = getMetroMapperByRegion(region);
        const districtMapper = getDistrictMapperByRegion(region);

        return SearchType({
            region,

            renovation: renovationMapper.toEnums(raw.renovation, raw.remont),

            rooms: roomMapper.toEnums(raw.rooms, raw.room),

            metroIds: metroMapper.toIds(raw.metroIds, raw.metro),
            districtIds: districtMapper.toIds(
                raw.districtIds,
                raw.rayon || raw.okrug
            ),
        });
    }

    toQuery(p: ISearchType) {
        const metroMapper = getMetroMapperByRegion(p.region);
        const metro =
            p.metroIds.length === 1
                ? metroMapper.seoFromType(p.metroIds[0])
                : undefined;

        const districtMapper = getDistrictMapperByRegion(p.region);

        const rayon =
            p.districtIds.length === 1 &&
            districtMapper.name === 'spbDistrictMapper'
                ? districtMapper.seoFromType(p.districtIds[0])
                : undefined;

        const okrug =
            p.districtIds.length === 1 &&
            districtMapper.name === 'mskDistrictMapper'
                ? districtMapper.seoFromType(p.districtIds[0])
                : undefined;

        return SearchSeoType({
            region: regionMapper.seoFromType(p.region),
            room:
                p.rooms.length === 1
                    ? roomMapper.seoFromType(p.rooms[0])
                    : undefined,
            rooms: p.rooms.length > 1 ? p.rooms : undefined,

            remont:
                p.renovation.length === 1
                    ? renovationMapper.seoFromType(p.renovation[0])
                    : undefined,
            renovation: p.renovation.length > 1 ? p.renovation : undefined,

            metro,
            metroIds: metro ? undefined : p.metroIds.map(String),

            rayon,
            okrug,
            districtIds: rayon || okrug ? undefined : p.districtIds.map(String),
        });
    }

    pattern(p: Tokens<ISearchSeoType>) {
        return `(/${p.region})/nedvizhimost/kupit-kvartiru(/${p.room})(/metro-${
        p.metro})(/rayon-${p.rayon})(/${p.okrug}-okrug)(/remont-${p.remont})`;
    }

    conditions() {
        return {
            room: roomMapper.keys,
        }
    }

    metadata = SearchSeoType.config;
}
