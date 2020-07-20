/**
 * The union of two types, where the second type's properties' types take precedence over the first type's.
 * @template T1 first type
 * @template T2 second type
 */
export type Override<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>> & T2
