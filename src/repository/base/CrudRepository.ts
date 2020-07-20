import { CreateOne, DeleteOne, ReadOne, UpdateOne } from '../actions'
import { EntityMerger, EntityReader, EntityWriter } from '../common'
import { FirestoreContext } from '../context'
import { RepositoryErrorHandler } from '../errors'

export type CrudRepository<T, ID> = {
  readonly createOne: CreateOne<T>
  readonly readOne: ReadOne<T, ID>
  readonly updateOne: UpdateOne<T, ID>
  readonly deleteOne: DeleteOne<ID>
}
export const CrudRepository = <Entity, Model, ID>(
  context: FirestoreContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  entityWriter: EntityWriter<Entity, Model>,
  entityMerger: EntityMerger<Entity, Model>,
  onFailure: RepositoryErrorHandler = RepositoryErrorHandler.defaultHandler,
): CrudRepository<Model, ID> => ({
  createOne: CreateOne(context, entityReader, entityWriter, onFailure),
  readOne: ReadOne(context, entityReader, onFailure),
  updateOne: UpdateOne(context, entityReader, entityMerger, onFailure),
  deleteOne: DeleteOne(context, onFailure),
})
