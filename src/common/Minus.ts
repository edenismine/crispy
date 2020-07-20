export type Minus<A, B> = Pick<A, Exclude<keyof A, keyof B>>
