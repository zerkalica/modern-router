import { invert } from '../../../schema'

const regionSeoToType = {
    'moscow': 'MSK',
    'spb': 'SPB',
} as const

const regionTypeToSeo = invert(regionSeoToType)

export function RegionSeo<K extends keyof typeof regionSeoToType>(value: K): K {
    if (!regionSeoToType[value]) throw new Error(`${value} not a RegionSeo type`)
    return value
}

export function RegionType<K extends keyof typeof regionTypeToSeo>(value: K): K {
    if (!regionTypeToSeo[value]) throw new Error(`${value} not a RegionType`)
    return value
}
