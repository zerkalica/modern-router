
export function fail(error: any): never {
    throw error
}

export function failHidden(error: any): never {
    throw error /// Use 'Never Pause Here' breakpoint in DevTools or simply blackbox this script
}
