import * as E from 'fp-ts/lib/Either'
import { Merger } from '../../common'
import { Absorber } from '../../utils'
import { RepositoryError } from '../errors'

export { Referenced } from './Referenced'

export const RepositoryUtils = {
  mergerOf: <Entity, Model>(
    absorber: Absorber<Entity, Model>,
  ): Merger<Entity, Partial<Model>, E.Either<RepositoryError, Entity>> => (
    entity,
    partialModel,
  ) => {
    try {
      return E.right(absorber(entity, partialModel))
    } catch (e) {
      return E.left(RepositoryError.ofAny('ValueError', e))
    }
  },
}
