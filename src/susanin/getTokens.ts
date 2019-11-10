import { Validator } from '../schema'
import { Tokens } from '../RouteType'

function tokenFromKey(key: string): string {
    return `<${key}>`
}

export function getTokens<Params>(validate: Validator<Params>): Tokens<Params> {
    const metadata = validate.metadata
    if (!metadata) throw new Error(`Schema ${validate} has no metadata`)
    const tokens = {} as Record<string, string | object>
    const keys: (keyof typeof metadata)[] = Object.keys(metadata)
    for (const key of keys) {
        const item = metadata[key]
        if (item && typeof item === 'object' && item.metadata) {
            tokens[key] = getTokens(item)
        }
        tokens[key] = tokenFromKey(key)
    }

    return tokens as Tokens<Params>
}
