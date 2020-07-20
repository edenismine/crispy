import { Override } from './Override'

export type Nested<T> = Override<T, { readonly parentId: string }>
