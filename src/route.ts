import { RouteConfig, AllRoutesConfig } from './RouteType'
import { Validator } from './schema'

export function route<Params, Data, Defaults extends Partial<Params> | undefined>(
    validate: Validator<Params>,
    config: Omit<RouteConfig<Params, Data, Defaults>, 'validate'>
): RouteConfig<Params, Data, Defaults> {
    return { ...config, validate }
}

/**
 *
 * ```ts
 * const r = route.config({
 *    search: route({
 *        schema: {
 *            controller: schema.num,
 *            action: schema.opt(schema.num),
 *            id: schema.str,
 *        },
 *        pattern: p => `/${p.action}/${p.id}/qwe`,
 *    }),
 *    offer: route({
 *        schema: {
 *            id: schema.str,
 *        },
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
