import { invert } from '../../../schema'

const renovationSeoMap = {
    'remont-euro': 'EURO',
    'remont-cosmeticheskii': 'COSMETIC',
    'remont-disainerskii': 'DESIGNED',
    'remont-nujen_remont': 'NEED',
    'remont-net_remonta': 'NONE',
} as const

const renovationTypeMap = invert(renovationSeoMap)

type RenovationSeoKey = keyof typeof renovationSeoMap
type RenovationTypeKey = keyof typeof renovationTypeMap

export function RenovationSeo(value: RenovationSeoKey) {
    if (!renovationSeoMap[value]) throw new Error(`${value} not a RenovationSeo type`)
    return value
}

export function RenovationType(value: RenovationTypeKey) {
    if (!renovationTypeMap[value]) throw new Error(`${value} not a RenovationType`)
    return value
}

export function renovationSeoToType(v: string | undefined): RenovationTypeKey | undefined {
    return renovationSeoMap[v as RenovationSeoKey]
}

export function renovationTypeToSeo(v: string | undefined): RenovationSeoKey | undefined {
    return renovationTypeMap[v as RenovationTypeKey]
}
