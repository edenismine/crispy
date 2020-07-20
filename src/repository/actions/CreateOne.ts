import { Transaction } from '@google-cloud/firestore'
import * as TE from 'fp-ts/lib/TaskEither'
import { EntityReader, EntityWriter } from '../common'
import { FirestoreContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Referenced } from '../utils'

export type CreateOne<Model> = (
  entity: Model,
  tx?: Transaction,
) => TE.TaskEither<RepositoryError, Model>
export const CreateOne = <Entity, Model, ID>(
  context: FirestoreContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  entityWriter: EntityWriter<Entity, Model>,
  onFailure: RepositoryErrorHandler,
): CreateOne<Model> => (model, tx) =>
  TE.tryCatch(async () => {
    const newEntityRef = context.getNewRef(model)
    const entity = entityWriter(Referenced(model, newEntityRef))
    await context.create(newEntityRef, entity, tx)
    return entityReader(Referenced(entity, newEntityRef))
  }, onFailure)
