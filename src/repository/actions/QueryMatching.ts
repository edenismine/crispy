import * as TE from 'fp-ts/lib/TaskEither'
import { EntityReader } from '../common'
import { CollectionContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Query } from '../query'
import { Referenced } from '../utils'

export type QueryMatching<Entity extends Record<string, unknown>, Model> = (
  query: Query<Entity>,
) => TE.TaskEither<RepositoryError, readonly Model[]>

export const QueryMatching = <
  Entity extends Record<string, unknown>,
  Model,
  ID
>(
  context: CollectionContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  onFailure: RepositoryErrorHandler,
): QueryMatching<Entity, Model> => (query) =>
  TE.tryCatch(async () => {
    const documents = await context.getMatching(query)
    return documents.docs.map((d) =>
      entityReader(Referenced(d.data() as Entity, d.ref)),
    )
  }, onFailure)
