
export function failHidden(error: Error | Promise<unknown>): never {
    throw error; /// Use 'Never Pause Here' breakpoint in DevTools or simply blackbox this script
}
