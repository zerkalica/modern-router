import { RouteConfig, AllRoutesConfig } from './RouterInterfaces'

export function route<
    Input,
    Output,
    Context = any,
    Data = any,
    Defaults extends Partial<Output> | undefined = any
>(
    config: RouteConfig<Input, Output, Data, Defaults, Context>
): RouteConfig<Input, Output, Data, Defaults, Context> {
    return config
}

/**
 *
 * ```ts
 * const r = route.config({
 *    search: route(
 *    s.rec({
 *        controller: s.num,
 *        action: s.opt(s.num),
 *        id: s.str,
 *    }),
 *    {
 *        pattern: p => `/${p.action}/${p.id}/qwe`,
 *    }),
 *    offer: route(
 *    s.rec({
 *        id: s.str,
 *    }),
 *    {
 *        pattern: p => `/offer/${p.id}`,
 *    }),
 * })
 * ```
 **/
function config<Config>(config: AllRoutesConfig<Config>): AllRoutesConfig<Config> {
    return config
}

route.config = config
