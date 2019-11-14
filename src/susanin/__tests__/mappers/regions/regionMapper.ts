import { SeoMapper } from '../../../../schema';
import { mskDistrictMapper, mskMetroMapper } from './msk';
import { spbDistrictMapper, spbMetroMapper } from './spb';

export const regionMapper = new SeoMapper('regionMapper', {
    moskva: 'MSK',
    'sankt-peterburg': 'SPB'
} as const);

export function getMetroMapperByRegion(
    region: ReturnType<typeof regionMapper.Type>
) {
    return region === 'MSK' ? mskMetroMapper : spbMetroMapper;
}

export function getDistrictMapperByRegion(
    region: ReturnType<typeof regionMapper.Type>
) {
    return region === 'MSK' ? mskDistrictMapper : spbDistrictMapper;
}
