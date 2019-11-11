import { invert, Invert } from './invert'

export class Mapper<Input extends Record<string, string>> {
    protected value: Input
    protected inversed: Invert<Input>
    constructor(v: Input) {
        this.value = v
        this.inversed = invert(v)
    }

    Value = (key: keyof Input) => {
        if (!this.value[key]) throw new Error(`${key} is not a ${this.constructor} type`)
        return key
    }

    Type = (key: keyof Invert<Input>) => {
        if (!this.inversed[key]) throw new Error(`${key} is not a ${this.constructor} type`)
        return key
    }

    toValue() {

    }
}
