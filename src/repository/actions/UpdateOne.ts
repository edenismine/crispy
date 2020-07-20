import { Transaction } from '@google-cloud/firestore'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { EntityMerger, EntityReader } from '../common'
import { FirestoreContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Referenced } from '../utils'

export type UpdateOne<Model, ID> = (
  id: ID,
  changes: Partial<Model>,
  tx?: Transaction,
) => TE.TaskEither<RepositoryError, Model>
export const UpdateOne = <Entity, Model, ID>(
  context: FirestoreContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  entityMerger: EntityMerger<Entity, Model>,
  onFailure: RepositoryErrorHandler,
): UpdateOne<Model, ID> => (id, changes, tx) =>
  TE.tryCatch(async () => {
    const entitySnapshot = await context.get(id, tx)
    if (entitySnapshot.exists) {
      const previous = entitySnapshot.data() as Entity
      const eNext = entityMerger(previous, changes)
      if (E.isLeft(eNext)) {
        const { left: error } = eNext
        return Promise.reject(error)
      }
      const { right: merged } = eNext
      await context.update(id, merged, tx)
      return entityReader(Referenced(merged, entitySnapshot.ref))
    } else {
      const error = RepositoryError.of(
        'NoSuchEntityError',
        `Entity with id ${id} does not exist or is not accessible`,
      )
      return Promise.reject(error)
    }
  }, onFailure)
