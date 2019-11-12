import { SeoMapper } from '../../../schema'

export const regionMapper = new SeoMapper('regionMapper', {
    'moskva': 'MSK',
    'moskva-i-oblast': 'MSK_AND_MSK_OBL',
    'sankt-peterburg_i_oblast': 'SPB_AND_LEN_OBL',
    'sankt-peterburg': 'SPB',
    'moskovsckaya-oblast': 'MSK_OBL',
    'leningrandskaya-oblast': 'LEN_OBL',
} as const)
