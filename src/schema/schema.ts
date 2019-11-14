import { failHidden } from './fail';

// import $ from 'mol_data_all';

// eslint-disable-next-line @typescript-eslint/camelcase, camelcase
// function maybeArray<In, Out = In>(type: $.$mol_data_value<In, Out>) {
//     return $.$mol_data_optional($.$mol_data_variant(type, $.$mol_data_array(type)));
// }

// export const s = {
//     str: $.$mol_data_string,
//     bool: $.$mol_data_boolean,
//     num: $.$mol_data_number,
//     variant: $.$mol_data_variant,
//     opt: $.$mol_data_optional,
//     list: $.$mol_data_array,
//     rec: $.$mol_data_record,
//     maybeArray
// } as const;

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

export class SchemaTypeError extends Error {

}

function rec<Sub extends Record<string, any>>(sub: Sub) {
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
        const res = {} as Output;

        // eslint-disable-next-line guard-for-in
        for (const field in sub) {
            try {
                res[field] = sub[field](val[field]);
            } catch (error) {
                if (! (error instanceof Promise)) {
                    error.message = `[${JSON.stringify(field)}] ${error.message || error}`;
                }
                return failHidden(error);
            }
        }

        return res as Readonly<Output>;
    };

    fn.config = sub as Record<string, any>;

    return fn;
}

function list<Sub extends Value>(sub: Sub) {
    return (val: readonly Parameters<Sub>[0][]) => {
        if (! Array.isArray(val)) throw new Error('is not an array');

        return val.map((item, index) => {
            try {
                return sub(item);
            } catch (error) {
                if (! (error instanceof Promise)) {
                    error.message = `[${index}] ${error.message || error}`;
                }
                return failHidden(error);
            }
        }) as readonly ReturnType<Sub>[];
    };
}

function num(val: number) {
    if (typeof val === 'number') return val;

    throw new SchemaTypeError('is not a number');
}

function bool(val: boolean) {
    if (typeof val === 'boolean') return val;

    throw new SchemaTypeError('is not a boolean');
}

function undef(val: undefined) {
    if (val === undefined) return val;

    throw new SchemaTypeError('is not a undefined');
}

function str(val: string) {
    if (typeof val === 'string') return val;

    throw new SchemaTypeError('is not a string');
}

type Metadata = Record<string, any>

export type Value<Input = any, Output = any> = ((val: Input) => Output) & { config?: Metadata }

export class SchemaVariantError extends SchemaTypeError {
    constructor(errors: SchemaTypeError[]) {
        super(errors.map(err => err.message).join(' and '));
        this.stack = errors.map(err => err.stack).join('\n\n') // + '\n\n' + this.stack;
    }
}

function variant<Sub extends Value[]>(...sub: Sub) {
    const fn: Value<Parameters<Sub[number]>[0], ReturnType<Sub[number]>> = (
        val: Parameters<Sub[number]>[0]
    ) => {
        const errors: SchemaTypeError[] = [];

        for (const type of sub) {
            try {
                return type(val) as ReturnType<Sub[number]>;
            } catch (error) {
                if ( !(error instanceof SchemaTypeError)) return failHidden(error);
                errors.push(error);
            }
        }

        throw new SchemaVariantError(errors);
    };

    let config = {} as Metadata;
    let hasMetadata = false;

    for (const item of sub) {
        if (item.config) {
            hasMetadata = true;
            config = { ...fn.config, ...item.config };
        }
    }
    if (hasMetadata) {
        fn.config = config;
    }

    return fn;
}

function opt<Sub extends Value>(sub: Sub) {
    return (val: Parameters<Sub>[0] | undefined) => {
        if (val === undefined) return undefined;

        return sub(val) as ReturnType<Sub>;
    };
}

export function wrapper<Pre extends Value, Obj extends { new(val: ReturnType<Pre>): unknown }>(
    pre: Pre,
    Obj: Obj
) {
    return (val: Parameters<Pre>[0]) => new Obj(pre(val)) as InstanceType<Obj>;
}

function maybeArray<In, Out = In>(type: Value<In, Out>) {
    return opt(variant(type, list(type)));
}

export const s = {
    str,
    bool,
    num,
    variant,
    opt,
    list,
    rec,
    undef,
    maybeArray
} as const;

export type Validator<Params> = Value<Params, Params>
