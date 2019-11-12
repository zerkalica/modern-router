import { invert } from '../../../schema'

const metroSeoMap = {
    'metro-admiralteiskaya': '5229',
} as const

const metroTypeMap = invert(metroSeoMap)

type MetroSeoKey = keyof typeof metroSeoMap
type MetroTypeKey = keyof typeof metroTypeMap

export function MetroSeo(value: MetroSeoKey) {
    if (!metroSeoMap[value]) throw new Error(`${value} not a MetroSeo type`)
    return value
}

export function MetroType(value: MetroTypeKey) {
    if (!metroTypeMap[value]) throw new Error(`${value} not a MetroType`)
    return value
}

export function metroSeoToType(v: string | undefined): MetroTypeKey | undefined {
    return metroSeoMap[v as MetroSeoKey]
}

export function metroTypeToSeo(v: string | undefined): MetroSeoKey | undefined {
    return metroTypeMap[v as MetroTypeKey]
}
