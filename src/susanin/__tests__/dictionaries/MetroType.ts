import { invert } from '../../../schema'

const metroSeoMap = {
    'metro-admiralteiskaya': '5229',
} as const

const metroTypeMap = invert(metroSeoMap)

type MetroSeoKey = keyof typeof metroSeoMap
type MetroTypeKey = keyof typeof metroTypeMap

export class MetroSeoTag {
    readonly value: MetroSeoKey
    constructor(value: MetroSeoKey) {
        this.value = value
    }
    toValue() {
        return this.value
    }
    toString() {
        return this.value
    }
}

export function MetroSeo(value: MetroSeoKey) {
    if (!metroSeoMap[value]) throw new Error(`${value} not a MetroSeo type`)
    return new MetroSeoTag(value)
}

export function MetroType(value: MetroTypeKey) {
    if (!metroTypeMap[value]) throw new Error(`${value} not a MetroType`)
    return value
}

export function metroSeoToType(v: MetroSeoKey | MetroSeoTag) {
    return metroSeoMap[v instanceof MetroSeoTag ? v.value : v]
}

export function metroTypeToSeo(v: MetroTypeKey) {
    return new MetroSeoTag(metroTypeMap[v])
}
