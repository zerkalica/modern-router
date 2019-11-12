import { failHidden } from '../../schema'

const processed = new WeakSet<Promise<any>>()

export function toPromise<V>(cb: () => V): Promise<V> {
    return new Promise<V>((resolve, reject) => {
        const retry = () => {
            try {
                resolve(cb())
            } catch (e) {
                if (processed.has(e)) return
                processed.add(e)
                if (e instanceof Promise) e.then(retry, reject)
                else reject(e)
            }
        }
        retry()
    })
}

export function memoFetch<V, Args extends any[]>(
    fn: (url: string, ...args: Args[]) => Promise<V>
) {
    const cache = new Map<string, any>()

    return (url: string, ...args: Args) => {
        const cached: V | Promise<V> = cache.get(url)
        if (cached instanceof Promise) return failHidden(cached)
        if (cached !== undefined) return cached

        const promise = fn(url, ...args).then(data => {
            cache.set(url, data)
        })
        cache.set(url, promise)

        return failHidden(promise)
    }
}

