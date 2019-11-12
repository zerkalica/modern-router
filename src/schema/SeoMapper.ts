import { Invert, invert } from './invert'

export class SeoMapper<SeoMap extends Record<string, string> = Record<string, string>> {
    protected seoMap: SeoMap
    protected typesMap: Invert<SeoMap>
    readonly name: string

    constructor(name: string, seo: SeoMap) {
        this.seoMap = seo
        this.name = name
        this.typesMap = invert(seo)
    }

    toString() {
        return this.name
    }

    Seo = (value: keyof SeoMap) => {
        if (!this.seoMap[value]) throw new Error(`${value} not key of ${this}`)
        return value
    }

    Type = (value: keyof Invert<SeoMap>) => {
        if (!this.typesMap[value]) throw new Error(`${value} not a value of ${this}`)
        return value
    }

    typeFromAny = (v: string | undefined): keyof Invert<SeoMap> | undefined => {
        return this.seoMap[v as keyof SeoMap]
    }

    typeFromSeo = (v: keyof SeoMap): keyof Invert<SeoMap> => {
        return this.seoMap[this.Seo(v)]
    }

    seoFromType = (v: keyof Invert<SeoMap>): keyof SeoMap => {
        return this.typesMap[this.Type(v)]
    }    
}
