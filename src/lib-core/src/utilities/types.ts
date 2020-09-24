export function assertNever(value: never): never {
    throw new Error(`unexpected value of type ${typeof value}`);
}


export function isArray<T>(value: unknown | readonly T[]): value is readonly T[];
export function isArray<T>(value: unknown | T[]): value is T[];
export function isArray<T>(value: unknown | T[]): value is T[] {
    return Array.isArray(value);
}

export function isString(value: unknown): value is string {
    return typeof value === 'string';
}


/**
 * Type safe {@link Omit}
 */
export type Skip<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// export type NullableProp<T, K extends keyof T> = Skip<T, K> & { [P in K]: T[P] | null };

// export type Writable<T> = { -readonly [K in keyof T]: T[K] };
