/* @flow */
import Observable from 'zen-observable'

export function observableAll(observables: Array<Observable>): Observable {
    function observableAllSubscriber(observer: SubscriptionObserver) {
        const subs: Array<Subscription> = observables.map(
            (observable: Observable) => observable.subscribe(observer)
        );

        function observableAllUnsubscribe(): void {
            subs.forEach((subscription: Subscription) => subscription.unsubscribe())
        }

        return observableAllUnsubscribe
    }
    return new Observable(observableAllSubscriber)
}

export function observableFromEvent<V, E>(target: Object, eventName: string): Observable<V, E> {
    function observableFromEventSubscriber(observer: SubscriptionObserver): () => void {
        function handler(data): void {
            observer.next(data)
        }
        if (typeof target.addEventListener === 'function') {
            target.addEventListener(eventName, handler)
        } else if (typeof target.attachEvent === 'function') {
            target.attachEvent('on' + eventName, handler)
        }

        function observableFromEventUnsubscribe(): void {
            if (typeof target.removeEventListener === 'function') {
                target.removeEventListener(eventName, handler)
            } else if (typeof target.detachEvent === 'function') {
                target.detachEvent('on' + eventName, handler)
            }
        }

        return observableFromEventUnsubscribe
    }

    return new Observable(observableFromEventSubscriber)
}
