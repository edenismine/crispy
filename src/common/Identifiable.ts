import { Override } from './Override'

export type Identifiable<T = Record<string, unknown>, ID = string> = Override<
  T,
  { readonly id: ID }
>
