type AllValues<T extends Record<PropertyKey, PropertyKey>> = {
    [P in keyof T]: { key: P; value: T[P] }
}[keyof T]

export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
    [P in AllValues<T>['value']]: Extract<AllValues<T>, { value: P }>['key']
}

export function invert<Input extends Record<PropertyKey, PropertyKey>>(obj: Input): Invert<Input> {
    const inverted = {} as Invert<Input>
    for (let key in obj) {
        inverted[obj[key]] = key
    }

    return inverted
}
