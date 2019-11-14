import { Tokens } from '../RouterInterfaces';

function tokenFromKey(key: string): string {
    return `<${key}>`;
}

export type TokenMetadata = Record<string, any>

export function getTokens<Params>(metadata: TokenMetadata, prefix = ''): Tokens<Params> {
    const tokens = {} as Record<string, string | object>;
    const keys = Object.keys(metadata) as readonly (keyof typeof metadata)[];

    for (const key of keys) {
        const item = metadata[key];
        const tokenKey = prefix + key 

        if (item && typeof item === 'object' && item.config) {
            tokens[tokenKey] = getTokens(item.config, tokenKey + '.');
        }
        tokens[tokenKey] = tokenFromKey(tokenKey);
    }

    return tokens as Tokens<Params>;
}
