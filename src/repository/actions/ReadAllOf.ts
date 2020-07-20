import * as TE from 'fp-ts/lib/TaskEither'
import { Nested } from '../../common'
import { EntityReader } from '../common'
import { NestedCollectionContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Referenced } from '../utils'

export type ReadAllOf<Model> = (
  parentId: string,
) => TE.TaskEither<RepositoryError, readonly Nested<Model>[]>
export const ReadAllOf = <Entity, Model>(
  context: NestedCollectionContext<Entity, Model>,
  entityReader: EntityReader<Entity, Nested<Model>>,
  onFailure: RepositoryErrorHandler,
): ReadAllOf<Model> => (parentId) =>
  TE.tryCatch(async () => {
    const documents = await context.getAllOf(parentId)
    return documents.docs.map((d) =>
      entityReader(Referenced(d.data() as Entity, d.ref)),
    )
  }, onFailure)
