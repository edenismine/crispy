import { Transaction } from '@google-cloud/firestore'
import * as TE from 'fp-ts/lib/TaskEither'
import { FirestoreContext } from '../context'

import { RepositoryError, RepositoryErrorHandler } from '../errors'

export type DeleteOne<ID> = (
  id: ID,
  tx?: Transaction,
) => TE.TaskEither<RepositoryError, null>
export const DeleteOne = <Entity, Model, ID>(
  context: FirestoreContext<Entity, Model, ID>,
  onFailure: RepositoryErrorHandler,
): DeleteOne<ID> => (id, tx) =>
  TE.tryCatch(async () => {
    await context.remove(id, tx)
    return null
  }, onFailure)
