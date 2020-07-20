import { Handler, Request, Response } from 'express'
import * as E from 'fp-ts/lib/Either'
import { ExpressTask, Minus } from '../common'

export * as DateUtils from './DateUtils'
export { Absorber } from './Absorber'

export const expressHandler = (task: ExpressTask): Handler => (
  req: Request,
  res: Response,
) => task(req, res)()

export const extend = <S, T extends S>(base: S, withProps: Minus<T, S>) => ({
  ...base,
  ...withProps,
})

/**
 * Checks if an object has a key
 * @param o an object
 * @param k a key
 */
export function hasKey<K extends string>(
  o: unknown,
  k: K,
): o is { [_ in K]: Record<string, unknown> } {
  return o !== null && typeof o === 'object' && k in o!
}

/**
 * If the provided either corresponds to the right branch, its value is returned, else the provided error(or a default
 * type error) error is thrown.
 * @param e the either
 * @param error an error
 */
export function getOrThrow<Left, Right, Er extends Error>(
  e: E.Either<Left, Right>,
  error?: Er,
): Right {
  if (E.isLeft(e)) {
    throw (
      error ?? new TypeError(`${typeof e} is not assignable to type 'Right<R>'`)
    )
  } else {
    return e.right
  }
}
