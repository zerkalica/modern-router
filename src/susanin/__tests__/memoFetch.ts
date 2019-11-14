import { failHidden } from '../../schema';

export function memoFetch<V, Args extends unknown[]>(
    fn: (url: string, ...args: Args) => Promise<V>
) {
    const cache = new Map<string, V | Promise<V>>();

    return (url: string, ...args: Args) => {
        const cached: V | Promise<V> | undefined = cache.get(url);

        if (cached instanceof Promise) return failHidden(cached);
        if (cached !== undefined) return cached;

        const promise = fn(url, ...args).then(data => {
            cache.set(url, data);
            return data;
        });

        cache.set(url, promise);

        return failHidden(promise);
    };
}
