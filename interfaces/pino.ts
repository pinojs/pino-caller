type ObjectOrString = Object | string

export type VALUES = "fatal" | "error" | "warn" | "info" | "debug" | "trace"

export interface LEVELS {
    values: VALUES[]
}

export interface Pino {
    fatal(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    error(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    warn(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    info(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    debug(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    trace(a: ObjectOrString, b?: string, c?: string, d?: string, e?: string, f?: string, g?: string, h?: string, i?: string, j?: string, k?: string)
    child(obj: Object): Pino
    levels: LEVELS
}
