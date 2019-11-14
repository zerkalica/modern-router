const processed = new WeakSet<Promise<unknown>>();

export function toPromise<V>(cb: () => V): Promise<V> {
    return new Promise<V>((resolve, reject) => {
        const retry = () => {
            try {
                resolve(cb());
            } catch (e) {
                if (e instanceof Promise) {
                    if (! processed.has(e)) {
                        processed.add(e);
                        e.then(retry, retry);
                    }
                } else reject(e);
            }
        };

        retry();
    });
}
