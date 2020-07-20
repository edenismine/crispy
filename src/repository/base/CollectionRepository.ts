import { ReadAll } from '../actions'
import { EntityMerger, EntityReader, EntityWriter } from '../common'
import { CollectionContext } from '../context'
import { RepositoryErrorHandler } from '../errors'
import { CrudRepository } from './CrudRepository'

export type CollectionRepository<T, ID> = CrudRepository<T, ID> & {
  readonly readAll: ReadAll<T>
}
export const CollectionRepository = <Entity, Model, ID>(
  context: CollectionContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  entityWriter: EntityWriter<Entity, Model>,
  entityMerger: EntityMerger<Entity, Model>,
  onFailure: RepositoryErrorHandler = RepositoryErrorHandler.defaultHandler,
): CollectionRepository<Model, ID> => ({
  ...CrudRepository(
    context,
    entityReader,
    entityWriter,
    entityMerger,
    onFailure,
  ),
  readAll: ReadAll(context, entityReader, onFailure),
})
