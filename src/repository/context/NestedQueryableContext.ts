import { QuerySnapshot } from '@google-cloud/firestore'
import { Nested, NestedId } from '../../common'
import { Query } from '../query'
import { FirestoreContext } from './FirestoreContext'

export type NestedQueryableContext<
  Entity extends Record<string, unknown>,
  Model
> = FirestoreContext<Entity, Nested<Model>, NestedId> & {
  getMatchingOf(parentId: string, query: Query<Entity>): Promise<QuerySnapshot>
}
