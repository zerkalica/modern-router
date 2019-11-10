type Merge<Intersection> = keyof Intersection extends string
    ? {
          [Key in keyof Intersection]: Merge<Intersection[Key]>
      }
    : Intersection

type PartialUpper<Val> = Merge<Partial<Val> & PickUpper<Val, undefined, unknown>>

type ExtractUpper<Input, Lower, Upper> = {
    [Field in keyof Input]: Lower extends Input[Field] ? never : Input[Field] extends Upper ? Field : never
}[keyof Input]

type PickUpper<Input, Lower, Upper> = Pick<Input, ExtractUpper<Input, Lower, Upper>>

function fail(error: any): never {
    throw error
}

function failHidden(error: any): never {
    throw error /// Use 'Never Pause Here' breakpoint in DevTools or simply blackbox this script
}

function tokenFromKey(key: string): string {
    return `<${key}>`
}

function createTokens<Sub extends Record<string, any>>(sub: Sub): Tokens<Sub> {
    const tokens = {} as Tokens<Sub>
    for (const field in sub) {
        const tokens = sub[field].tokens
        tokens[field] = tokens || tokenFromKey(field)
    }

    return tokens
}

function record<Sub extends Record<string, any>>(sub: Sub) {
    type Input = PartialUpper<
        {
            [key in keyof Sub]: Parameters<Sub[key]>[0]
        }
    >

    type Output = PartialUpper<
        {
            [key in keyof Sub]: ReturnType<Sub[key]>
        }
    >

    const fn = (val: Input) => {
        let res = {} as Output

        for (const field in sub) {
            try {
                res[field] = sub[field](val[field])
            } catch (error) {
                return failHidden(new Error(`[${JSON.stringify(field)}] ${error.message || error}`))
            }
        }

        return res as Readonly<Output>
    }
    fn.tokens = createTokens(sub)

    return fn
}

function array<Sub extends value>(sub: Sub) {
    return (val: readonly Parameters<Sub>[0][]) => {
        if (!Array.isArray(val)) return fail(new Error('is not an array'))

        return val.map((item, index) => {
            try {
                return sub(item)
            } catch (error) {
                return failHidden(new Error(`[${index}] ${error.message || error}`))
            }
        }) as readonly ReturnType<Sub>[]
    }
}

function number(val: number) {
    if (typeof val === 'number') return val

    return fail(new Error('is not a number'))
}

function boolean(val: boolean) {
    if (typeof val === 'boolean') return val

    return fail(new Error('is not a boolean'))
}

function string(val: string) {
    if (typeof val === 'string') return val

    return fail(new Error('is not a string'))
}

type value<Input = any, Output = any> = ((val: Input) => Output) & { tokens?: Tokens<Output> }

function createTokensFromVariant<Sub extends value[], Out>(sub: Sub) {
    const tokens = {} as Record<string, any>
    for (const type of sub) {
        const typeTokens = type.tokens
        if (!typeTokens) continue
        for (const childKey in typeTokens) {
            tokens[childKey] = typeTokens[childKey]
        }
    }

    return tokens as Tokens<Out>
}

function variant<Sub extends value[]>(...sub: Sub) {
    const fn = (val: Parameters<Sub[number]>[0]) => {
        const errors = [] as String[]

        for (const type of sub) {
            try {
                return type(val) as ReturnType<Sub[number]>
            } catch (error) {
                errors.push(error.message)
            }
        }

        return fail(new Error(errors.join(' and ')))
    }
    fn.tokens = createTokensFromVariant(sub)
    return fn
}

function optional<Sub extends value>(sub: Sub) {
    return (val: Parameters<Sub>[0] | undefined) => {
        if (val === undefined) return undefined

        return sub(val) as ReturnType<Sub>
    }
}

export const s = {
    str: string,
    bool: boolean,
    num: number,
    var: variant,
    opt: optional,
    arr: array,
    rec: record,
} as const

export type Validator<Params> = (p: Params) => Readonly<Params>

type Primitive = string | number | boolean | symbol | undefined

export type Tokens<Params> = {
    [P in keyof Params]-?: Params[P] extends Primitive
        ? string
        : Params[P] extends any[]
        ? Params[P]
        : Tokens<Params[P]>
}

export type ParamsType<Params extends Record<string, any>> = ((val: Params) => Readonly<Params>) & {
    tokens?: Tokens<Params>
}

export function getTokens<Params>(schema: ParamsType<Params>): Tokens<Params> {
    if (!schema.tokens) throw new Error(`${schema} has no tokens`)
    return schema.tokens
}
