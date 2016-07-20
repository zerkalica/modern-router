// @flow
import type {QueryMap, LocationData} from 'modern-router/interfaces'

export default class AbstractLocation {
    /* eslint-disable */
    redirect(url: string): void {}
    replace(url: string): void {}
    getParams(): LocationData {
        throw new Error('implement')
    }
    pushState(query: QueryMap, name: string, url: string): void {}
    replaceState(query: QueryMap, name: string, url: string): void {}
}
