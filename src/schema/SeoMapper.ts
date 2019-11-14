import { Invert, invert } from './invert';
import { SchemaTypeError } from './schema';

export class SeoMapper<
    SeoMap extends Record<string, string | number> = Record<
        string,
        string | number
    >
> {
    protected seoMap: SeoMap;
    protected typesMap: Invert<SeoMap>;
    readonly name: string;

    constructor(name: string, seo: SeoMap) {
        this.seoMap = seo;
        this.name = name;
        this.typesMap = invert(seo);
    }

    toString() {
        return this.name;
    }

    get keys(): readonly (keyof SeoMap & string)[] {
        return Object.keys(this.seoMap);
    }

    get values(): readonly (keyof Invert<SeoMap> & string)[] {
        return (Object.keys(this.typesMap) as unknown) as (keyof Invert<
            SeoMap
        > &
            string)[];
    }

    SeoType = (value: keyof SeoMap) => {
        if (! this.seoMap[value]) throw new SchemaTypeError(`${value} not key of ${this}`);
        return value;
    };

    Type = (value: keyof Invert<SeoMap>) => {
        if (! this.typesMap[value]) {
            throw new SchemaTypeError(`${value} not a value of ${this}`);
        }
        return value;
    };

    toEnums(
        orig: readonly (keyof Invert<SeoMap>)[] | keyof Invert<SeoMap> | undefined,
        seo: keyof SeoMap | undefined
    ): readonly (keyof Invert<SeoMap>)[] {
        if (orig) return Array.isArray(orig) ? orig : [ orig ];

        const type = seo ? this.seoMap[seo] : undefined;

        return type === undefined ? [] : [ type ];
    }

    toIds(
        orig: readonly string[] | string | undefined,
        seo: string | undefined
    ): readonly number[] {
        if (orig) return Array.isArray(orig) ? orig.map(Number) : [ Number(orig) ];

        const type = seo ? this.seoMap[seo] : undefined;

        return type === undefined ? [] : [ Number(type) ];
    }

    typeFromSeo = (v: keyof SeoMap): keyof Invert<SeoMap> => {
        return this.seoMap[this.SeoType(v)];
    };

    seoFromType = (v: keyof Invert<SeoMap>): keyof SeoMap => {
        return this.typesMap[this.Type(v)];
    };
}

export function queryParamtoArray<V>(
    orig: readonly V[] | V | undefined
): readonly V[] {
    if (orig) return Array.isArray(orig) ? orig : [ orig ];
    return [];
}
