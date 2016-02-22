/* @flow */
import Observable from 'zen-observable'

export function observableFromEvent<V, E>(target: Object, eventName: string): Observable<V, E> {
    function subscriber(observer: SubscriptionObserver): Subscription {
        function handler(data): void {
            observer.next(data)
        }
        if (typeof target.addEventListener === 'function') {
            target.addEventListener(eventName, handler)
        } else if (typeof target.attachEvent === 'function') {
            target.attachEvent('on' + eventName, handler)
        }

        return {
            unsubscribe() {
                if (typeof target.removeEventListener === 'function') {
                    target.removeEventListener(eventName, handler)
                } else if (typeof target.detachEvent === 'function') {
                    target.detachEvent('on' + eventName, handler)
                }
            }
        }
    }

    return new Observable(subscriber)
}
