import { SeoMapper } from '../../../schema';

export const renovationMapper = new SeoMapper('renovation', {
    euro: 'EURO',
    'net-remonta': 'NONE'
} as const);
