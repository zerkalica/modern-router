// @flow
import type {QueryMap, LocationData} from 'modern-router/interfaces'

export type LocationCallback = (data: LocationData) => void
export default class AbstractLocation {
    /* eslint-disable */
    redirect(url: string): void {}
    redirectPost(url: string, params: {[id: string]: string}): void {}
    replace(url: string): void {}
    pushState(query: QueryMap, name: string, url: string): void {}
    replaceState(query: QueryMap, name: string, url: string): void {}
    dispose(): void {}
    onChange(fn: LocationCallback): () => void {
        throw new Error('Not implemented')
    }
    getParams(): LocationData {
        throw new Error('Not implemented')
    }
}
