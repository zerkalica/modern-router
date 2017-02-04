// @flow

export type Callback<V> = (v: V) => void

export default class Callbacks<V> {
    _callbacks: Callback<V>[] = []

    next(data: V): void {
        const cbs = this._callbacks
        for (let i = 0; i < cbs.length; i++) {
            const cb = cbs[i]
            cb(data)
        }
    }

    dispose(): void {
        this._callbacks = []
    }

    onChange(fn: Callback<V>): () => void {
        this._callbacks.push(fn)

        const filterCallbacks = (cb: Callback<*>) => cb !== fn
        const unsubscribe = () => {
            this._callbacks = this._callbacks.filter(filterCallbacks)
        }

        return unsubscribe
    }
}
