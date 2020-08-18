import * as TE from 'fp-ts/lib/TaskEither'
import { Nested } from '../../common'
import { EntityReader } from '../common'
import { NestedCollectionContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Query } from '../query'
import { Referenced } from '../utils'

export type QueryMatchingOf<Entity extends Record<string, unknown>, Model> = (
  parentId: string,
  query: Query<Entity>,
) => TE.TaskEither<RepositoryError, readonly Nested<Model>[]>

export const QueryMatchingOf = <Entity extends Record<string, unknown>, Model>(
  context: NestedCollectionContext<Entity, Model>,
  entityReader: EntityReader<Entity, Nested<Model>>,
  onFailure: RepositoryErrorHandler,
): QueryMatchingOf<Entity, Model> => (parentId, query) =>
  TE.tryCatch(async () => {
    const documents = await context.getMatchingOf(parentId, query)
    return documents.docs.map((d) =>
      entityReader(Referenced(d.data() as Entity, d.ref)),
    )
  }, onFailure)
