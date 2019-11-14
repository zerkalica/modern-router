import React from 'react';

import { LocationLike, Router, RouterOptions } from '../index.js';

export type RouterProviderProps<Context> = {
    children: React.ReactChild;
    location: LocationLike;
} & Omit<RouterOptions<Context>, 'routes' | 'history' | 'refresh'>;

export function createRouterProvider<Context>() {
    const RouterContext = React.createContext<Router<Context> | undefined>(
        undefined
    );

    function RouterProvider({
        children,
        context,
        location,
        target
    }: RouterProviderProps<Context>) {
        const [ count, setCount ] = React.useState(0);
        const history = target ? target.history : undefined;
        const router = React.useMemo(
            () =>
                new Router({
                    context,
                    location,
                    history,
                    target,
                    refresh: () => setCount(count + 1)
                }),
            [ count, Router.key(location), history, target ]
        );

        React.useEffect(() => {
            return () => {
                router.destructor();
            };
        }, [ router ]);

        return (
            <RouterContext.Provider value={router}>
                {children}
            </RouterContext.Provider>
        );
    }

    function useRouter() {
        const router = React.useContext(RouterContext);

        if (! router) {
            throw new Error('Wrap your application into <RouterProvider>');
        }
        return router;
    }

    return { RouterProvider, useRouter };
}
