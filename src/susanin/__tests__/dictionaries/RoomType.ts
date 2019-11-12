import { invert } from '../../../schema'

const roomSeoMap = {
    studio: 'STUDIO',
    '1-komnata': 'ROOM_1',
    '2-komnaty': 'ROOM_2',
    '3-komnaty': 'ROOM_3',
    '4-komnaty': 'ROOM_4',
    '5-komnat_i_bolee': 'ROOM_5_AND_MORE',
    svobodnaya_planirovka: 'OPEN_PLAN',
} as const

const roomTypeMap = invert(roomSeoMap)

type RoomSeoKey = keyof typeof roomSeoMap
type RoomTypeKey = keyof typeof roomTypeMap

export function RoomSeo(value: RoomSeoKey) {
    if (!roomSeoMap[value]) throw new Error(`${value} not a RoomSeo type`)
    return value
}

export function RoomType(value: RoomTypeKey) {
    if (!roomTypeMap[value]) throw new Error(`${value} not a RoomType`)
    return value
}

export function roomSeoToType(v: string | undefined): RoomTypeKey | undefined {
    return roomSeoMap[v as RoomSeoKey]
}

export function roomTypeToSeo(v: string | undefined): RoomSeoKey | undefined {
    return roomTypeMap[v as RoomTypeKey]
}
