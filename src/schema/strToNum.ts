export function strToNum(value: string | undefined | null): number | undefined {
    return value === undefined || value === null ? undefined : Number(value);
}

export function numToStr(value: number | undefined | null): string | undefined {
    return value === undefined || value === null ? undefined : String(value);
}
