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
    fn.metadata = sub

    return fn
}

function array<Sub extends Value>(sub: Sub) {
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

function undef(val: undefined) {
    if (val === undefined) return val

    return fail(new Error('is not a undefined'))
}

function string(val: string) {
    if (typeof val === 'string') return val

    return fail(new Error('is not a string'))
}

type Metadata = Record<string, any>

type Value<Input = any, Output = any> = ((val: Input) => Output) & { metadata?: Metadata }

function variant<Sub extends Value[]>(...sub: Sub) {
    const fn: Value<Parameters<Sub[number]>[0], ReturnType<Sub[number]>> = (
        val: Parameters<Sub[number]>[0]
    ) => {
        const errors = [] as string[]

        for (const type of sub) {
            try {
                return type(val) as ReturnType<Sub[number]>
            } catch (error) {
                errors.push(error.message)
            }
        }

        return fail(new Error(errors.join(' and ')))
    }
    let metadata = {} as Metadata
    let hasMetadata = false
    for (const item of sub) {
        if (item.metadata) {
            hasMetadata = true
            metadata = { ...fn.metadata, ...item.metadata }
        }
    }
    if (hasMetadata) {
        fn.metadata = metadata
    }

    return fn
}

function optional<Sub extends Value>(sub: Sub) {
    return (val: Parameters<Sub>[0] | undefined) => {
        if (val === undefined) return undefined

        return sub(val) as ReturnType<Sub>
    }
}

function wrapper<Pre extends Value, Obj extends { new (val: ReturnType<Pre>): any }>(pre: Pre, Obj: Obj) {
    return (val: Parameters<Pre>[0]) => new Obj(pre(val)) as InstanceType<Obj>
}

function tag<In, Out, Tag extends string>(tag: Tag, sub: Value<In, Out>) {
    return (value: In) => ({ t: tag, v: sub(value) })
}

export const s = {
    str: string,
    bool: boolean,
    num: number,
    var: variant,
    opt: optional,
    arr: array,
    rec: record,
    undef,
    tag,
    wrapper,
} as const

export type Validator<Params> = Value<any, Params>
