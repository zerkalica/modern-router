import { RouteConfig, AllRoutesConfig } from './RouteType'
import { Validator } from './schema'

export function route<
    Context,
    Input = any,
    Output = any,
    Data = any,
    Defaults extends Partial<Output> | undefined = any
>(
    input: Validator<Input>,
    config: Omit<RouteConfig<Input, Output, Data, Defaults, Context>, 'input' | 'output'>
): RouteConfig<Input, Output, Data, Defaults, Context> {
    return {...config, input}
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
