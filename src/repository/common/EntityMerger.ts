import * as E from 'fp-ts/lib/Either'
import { Merger } from '../../common'
import { RepositoryError } from '../errors'

export type EntityMerger<Entity, Model> = Merger<
  Entity,
  Partial<Model>,
  E.Either<RepositoryError, Entity>
>
