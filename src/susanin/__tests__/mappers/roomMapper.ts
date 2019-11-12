import { SeoMapper } from '../../../schema'

export const roomMapper = new SeoMapper('roomMapper', {
    studio: 'STUDIO',
    '1-komnata': 'ROOM_1',
    '2-komnaty': 'ROOM_2',
    '3-komnaty': 'ROOM_3',
    '4-komnaty': 'ROOM_4',
    '5-komnat_i_bolee': 'ROOM_5_AND_MORE',
    svobodnaya_planirovka: 'OPEN_PLAN',
} as const)
