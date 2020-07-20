import * as TE from 'fp-ts/lib/TaskEither'

import { EntityReader } from '../common'
import { CollectionContext } from '../context'
import { RepositoryError, RepositoryErrorHandler } from '../errors'
import { Referenced } from '../utils'

export type ReadAll<Model> = () => TE.TaskEither<
  RepositoryError,
  readonly Model[]
>
export const ReadAll = <Entity, Model, ID>(
  context: CollectionContext<Entity, Model, ID>,
  entityReader: EntityReader<Entity, Model>,
  onFailure: RepositoryErrorHandler,
): ReadAll<Model> => () =>
  TE.tryCatch(async () => {
    const documents = await context.getAll()
    return documents.docs.map((d) =>
      entityReader(Referenced(d.data() as Entity, d.ref)),
    )
  }, onFailure)
