import { Nested, NestedId } from '../../common'
import { ReadAllOf } from '../actions'
import { EntityMerger, EntityReader, EntityWriter } from '../common'
import { NestedCollectionContext } from '../context'
import { RepositoryErrorHandler } from '../errors'
import { CrudRepository } from './CrudRepository'

export type NestedCollectionRepository<T> = CrudRepository<
  Nested<T>,
  NestedId
> & {
  readonly readAllOf: ReadAllOf<T>
}
export const NestedCollectionRepository = <
  Entity extends Record<string, unknown>,
  Model
>(
  context: NestedCollectionContext<Entity, Model>,
  entityReader: EntityReader<Entity, Nested<Model>>,
  entityWriter: EntityWriter<Entity, Nested<Model>>,
  entityMerger: EntityMerger<Entity, Nested<Model>>,
  onFailure: RepositoryErrorHandler = RepositoryErrorHandler.defaultHandler,
): NestedCollectionRepository<Model> => ({
  ...CrudRepository(
    context,
    entityReader,
    entityWriter,
    entityMerger,
    onFailure,
  ),
  readAllOf: ReadAllOf(context, entityReader, onFailure),
})
