import { SeoMapper } from '../../../schema';

export const roomMapper = new SeoMapper('roomMapper', {
    '1-komnata': 'ROOM_1',
    '2-komnaty': 'ROOM_2',
    '3-komnaty': 'ROOM_3'
} as const);
