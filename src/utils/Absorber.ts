import * as R from 'rambda'
import { Merger } from '../common'

export type Absorber<A, B> = Merger<A, Partial<B>, A>
export const Absorber = {
  of: <A = Record<string, unknown>, B = Record<string, unknown>>(
    handlers: {
      [key in keyof A & keyof B]: (prev: A[key], next: B[key]) => A[key]
    },
    overrides: (merged: A, prev: A, next: Partial<B>) => Partial<A> = (
      _prev,
      _next,
    ) => ({}),
  ): Absorber<A, B> => (previous: A, changes: Partial<B>): A => {
    const previousProps = Object.keys(previous)
    const incomingProps = Object.keys(changes)
    const intersectionProps = previousProps.filter(
      (p) => incomingProps.indexOf(p) >= 0,
    )
    let merged = { ...previous }
    for (const i of intersectionProps) {
      const key = i as keyof A & keyof Partial<B>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      merged = R.assoc(i)(handlers[key](previous[key], changes[key]!), merged)
    }
    return { ...merged, ...overrides(merged, previous, changes) }
  },
  keepPrevious: <T>(a: T, _: unknown): T => a,
  keepIncoming: <T>(_: unknown, b: T): T => b,
}
