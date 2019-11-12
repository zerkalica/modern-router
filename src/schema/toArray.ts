export function toArray<V>(v: V | readonly V[] | undefined): V[] | undefined {
    return Array.isArray(v) ? v : v === undefined ? undefined : [v]
}
