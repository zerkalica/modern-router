// @flow

export default function shallowEqual(oldProps: Object, props: Object): boolean {
    if (oldProps === props) {
        return true
    }
    if ((!oldProps && props) || (!props && oldProps)) {
        return false
    }

    let lpKeys: number = 0
    for (let k in oldProps) { // eslint-disable-line
        if (oldProps[k] !== props[k]) {
            return false
        }
        lpKeys++
    }
    for (let k in props) { // eslint-disable-line
        lpKeys--
    }
    if (lpKeys) {
        return false
    }

    return true
}
