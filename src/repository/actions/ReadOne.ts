import { Transaction } from '@google-cloud/firestore'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { EntityReader } from '../common'
import { FirestoreContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Referenced } from '../utils'

export type ReadOne<Model, ID> = (
  id: ID,
  tx?: Transaction,
) => TE.TaskEither<RepositoryError, O.Option<Model>>
export const ReadOne = <Entity, Model, ID>(
  context: FirestoreContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  onFailure: RepositoryErrorHandler,
): ReadOne<Model, ID> => (id, tx) =>
  TE.tryCatch(async () => {
    const entitySnapshot = await context.get(id, tx)
    if (entitySnapshot.exists) {
      return O.some(
        entityReader(
          Referenced(entitySnapshot.data() as Entity, entitySnapshot.ref),
        ),
      )
    } else return O.none
  }, onFailure)
