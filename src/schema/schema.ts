import { failHidden } from './fail'

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

export type RecMetadata = {metadata: Record<string, any>}

function Rec<Sub extends Record<string, any>>(sub: Sub) {
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
    fn.metadata = sub as Record<string, any>

    return fn
}

function List<Sub extends Value>(sub: Sub) {
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

function Num(val: number) {
    if (typeof val === 'number') return val

    throw new Error('is not a number')
}

function Bool(val: boolean) {
    if (typeof val === 'boolean') return val

    throw new Error('is not a boolean')
}

function Undef(val: undefined) {
    if (val === undefined) return val

    throw new Error('is not a undefined')
}

function Str(val: string) {
    if (typeof val === 'string') return val

    throw new Error('is not a string')
}

type Metadata = Record<string, any>

export type Value<Input = any, Output = any> = ((val: Input) => Output) & { metadata?: Metadata }

function Var<Sub extends Value[]>(...sub: Sub) {
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

function Opt<Sub extends Value>(sub: Sub) {
    return (val: Parameters<Sub>[0] | undefined) => {
        if (val === undefined) return undefined

        return sub(val) as ReturnType<Sub>
    }
}

export function wrapper<Pre extends Value, Obj extends { new (val: ReturnType<Pre>): any }>(
    pre: Pre,
    Obj: Obj
) {
    return (val: Parameters<Pre>[0]) => new Obj(pre(val)) as InstanceType<Obj>
}

export const s = {
    Str,
    Bool,
    Num,
    Var,
    Opt,
    List,
    Rec,
    Undef,
} as const

export type Validator<Params> = Value<Params, Params>
