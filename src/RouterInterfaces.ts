export interface LocationLike {
    search: string;
    origin: string;
    pathname: string;
    hostname: string;
    port: string;
    hash: string;
    protocol: string;

    method?: string;
}

export interface HistoryLike {
    pushState(
        data: object | undefined | null,
        title: string,
        url?: string | null
    ): void;
    replaceState(
        data: object | undefined | null,
        title: string,
        url?: string | null
    ): void;
}

export type Tokens<Params> = {
    [P in keyof Params]-?: Params[P] extends PropertyKey
        ? string
        : Params[P] extends {}[]
        ? never
        : Tokens<Params[P]>;
};
