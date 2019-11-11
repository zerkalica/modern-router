import { RouteConfig, AllRoutesConfig } from './RouteType'
import { Validator } from './schema'

export function route<Context, Params = any, Data = any, Defaults extends Partial<Params> | undefined = any>(
    validate: Validator<Params>,
    config: Omit<RouteConfig<Params, Data, Defaults, Context>, 'validate'>
): RouteConfig<Params, Data, Defaults, Context> {
    return { ...config, validate }
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
function config<Config>(
    config: AllRoutesConfig<Config>
): AllRoutesConfig<Config> {
    return config
}

route.config = config
